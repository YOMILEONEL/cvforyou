"use server";

import type { ResumeData } from "@/app/(app)/editor/types";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";
import {
  matchResumeAgainstJobPosting,
  ResumeMatchError,
  type ResumeMatchErrorCode,
  type ResumeMatchResult,
} from "@/app/lib/match/gemini-client";
import { createClient } from "@/app/lib/supabase/server";

export type MatchErrorCode =
  | "empty_input"
  | "input_too_long"
  | "not_authenticated"
  | "daily_limit_reached"
  | "unexpected"
  | ResumeMatchErrorCode;

export type MatchResumeState =
  | { status: "idle" }
  | { status: "error"; error: string; code: MatchErrorCode }
  | { status: "success"; result: ResumeMatchResult };

const MAX_JOB_POSTING_LENGTH = 8000;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// Read-only check so the editor page can show the daily-limit notice up
// front, before the user types a job posting and hits submit only to be
// told they're out of checks for today.
export async function getJobMatchUsedToday(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("resume_match_usage")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("checked_on", todayIso())
    .maybeSingle();

  return !!data;
}

export async function matchResumeToJob(resumeData: ResumeData, jobPosting: string): Promise<MatchResumeState> {
  const dict = await getDictionary();
  const t = dict.editor.jobMatch;

  const trimmed = jobPosting.trim();
  if (!trimmed) {
    return { status: "error", error: t.errorEmptyInput, code: "empty_input" };
  }
  if (trimmed.length > MAX_JOB_POSTING_LENGTH) {
    return {
      status: "error",
      error: t.errorInputTooLong.replace("{max}", String(MAX_JOB_POSTING_LENGTH)),
      code: "input_too_long",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", error: dict.common.notAuthenticated, code: "not_authenticated" };
  }

  const today = todayIso();

  // Insert first, call Gemini second: the (user_id, checked_on) primary key
  // makes this insert the atomic "have they already checked today" gate:
  // no separate read-then-write race window. A unique violation (23505)
  // means today's check is already used.
  const { error: insertError } = await supabase
    .from("resume_match_usage")
    .insert({ user_id: user.id, checked_on: today });

  if (insertError) {
    if (insertError.code === "23505") {
      return { status: "error", error: t.errorDailyLimitReached, code: "daily_limit_reached" };
    }
    return { status: "error", error: t.errorStartFailed, code: "unexpected" };
  }

  try {
    const result = await matchResumeAgainstJobPosting(resumeData, trimmed);
    return { status: "success", result };
  } catch (error) {
    // Gemini call failed after we already claimed today's check, give it
    // back so a transient or app-wide-quota error doesn't cost the user
    // their daily attempt.
    await supabase.from("resume_match_usage").delete().eq("user_id", user.id).eq("checked_on", today);

    if (error instanceof ResumeMatchError) {
      return { status: "error", error: error.message, code: error.code };
    }
    return { status: "error", error: t.errorUnexpected, code: "unexpected" };
  }
}
