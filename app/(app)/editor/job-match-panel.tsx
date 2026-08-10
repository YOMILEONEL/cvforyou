"use client";

import { useState, useTransition } from "react";

import type { ResumeData } from "@/app/(app)/editor/types";
import { RobotIcon } from "@/app/components/robot-icon";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";
import { matchResumeToJob, type MatchErrorCode, type MatchResumeState } from "@/app/lib/match-actions";
import { MATCH_UI_STRINGS } from "@/app/lib/match-i18n";

type JobMatchPanelProps = {
  resume: ResumeData;
  usedToday: boolean;
};

function ResultList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-wide text-ink/50 dark:text-ink-dark/50">{title}</h3>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink/80 dark:text-ink-dark/80">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span aria-hidden="true" className="text-rust">
              →
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobMatchPanel({ resume, usedToday }: JobMatchPanelProps) {
  const [jobPosting, setJobPosting] = useState("");
  const [state, setState] = useState<MatchResumeState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const { dict } = useDictionary();
  const jm = dict.editor.jobMatch;

  function handleCheck() {
    startTransition(async () => {
      const result = await matchResumeToJob(resume, jobPosting);
      setState(result);
    });
  }

  // Result-card labels follow the *resume's* language (the AI's own
  // answer), separate from jm above, which is the platform UI chrome.
  const resultUi = MATCH_UI_STRINGS[resume.language];

  // Two different "no capacity right now" cases, each with a short label so
  // the two are never confused: your own daily check vs. the app's shared
  // Google-quota for the day. Everything else (bad input, technical
  // failure) renders as a plain error line below.
  const quotaLabels: Partial<Record<MatchErrorCode, string>> = {
    daily_limit_reached: jm.quotaLabelDaily,
    app_quota_exceeded: jm.quotaLabelApp,
  };

  // Show the daily-limit notice immediately if the server already told us
  // (via the page load) that today's check is used, no need to make the
  // user paste a job posting and hit submit just to find that out. Once a
  // real attempt returns a different error, that error takes over.
  const notice =
    state.status === "error"
      ? { code: state.code, message: state.error }
      : state.status === "idle" && usedToday
        ? { code: "daily_limit_reached" as const, message: jm.errorDailyLimitReached }
        : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <RobotIcon className="mt-0.5 h-4 w-4 flex-none text-rust" />
        <p className="text-sm text-ink/70 dark:text-ink-dark/70">{jm.intro}</p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
        {jm.textareaLabel}
        <textarea
          rows={10}
          value={jobPosting}
          onChange={(event) => setJobPosting(event.target.value)}
          placeholder={jm.textareaPlaceholder}
          className="border border-ink/30 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-rust dark:border-ink-dark/30 dark:bg-paper-dark dark:text-ink-dark"
        />
      </label>

      <button
        type="button"
        onClick={handleCheck}
        disabled={isPending || !jobPosting.trim() || usedToday}
        className="self-start border border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper shadow-[3px_3px_0_0_var(--color-rust)] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
      >
        {isPending ? jm.submitPending : jm.submit}
      </button>

      {notice &&
        (quotaLabels[notice.code] ? (
          <div className="flex flex-col gap-1 border border-dashed border-rust/50 bg-rust/5 px-4 py-3 text-sm text-ink/80 dark:border-rust/40 dark:text-ink-dark/80">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              {quotaLabels[notice.code]}
            </span>
            <span>{notice.message}</span>
          </div>
        ) : (
          <p className="text-sm text-rust">{notice.message}</p>
        ))}

      {state.status === "success" && (
        <div className="mt-2 flex flex-col gap-6 border border-ink bg-sheet p-6 shadow-[6px_6px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[6px_6px_0_0_var(--color-ink-dark)]">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-4xl font-medium text-ink dark:text-ink-dark">
              {state.result.score}%
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">{resultUi.matchScoreLabel}</span>
          </div>

          <ResultList title={resultUi.matchedSkillsTitle} items={state.result.matchedSkills} />
          <ResultList title={resultUi.missingSkillsTitle} items={state.result.missingSkills} />
          <ResultList title={resultUi.suggestionsTitle} items={state.result.suggestions} />
          <ResultList title={resultUi.strengthsTitle} items={state.result.strengths} />
        </div>
      )}
    </div>
  );
}
