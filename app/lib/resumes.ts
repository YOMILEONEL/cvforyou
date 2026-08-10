import "server-only";

import { notFound, redirect } from "next/navigation";

import {
  initialResumeData,
  initialSectionMeta,
  type ResumeData,
  type SectionMeta,
} from "@/app/(app)/editor/types";
import { createClient } from "@/app/lib/supabase/server";
import { templates } from "@/app/lib/templates";

export type ResumeSummary = {
  id: string;
  title: string;
  templateName: string;
  updatedAt: string;
};

export type ResumeRecord = ResumeSummary & {
  data: ResumeData;
  sectionMeta: SectionMeta[];
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, userId: user.id };
}

export async function listResumes(): Promise<ResumeSummary[]> {
  const { supabase, userId } = await requireUser();

  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, template_name, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    templateName: row.template_name as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function getResume(id: string): Promise<ResumeRecord> {
  const { supabase, userId } = await requireUser();

  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, template_name, section_meta, data, updated_at")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  return {
    id: data.id as string,
    title: data.title as string,
    templateName: data.template_name as string,
    updatedAt: data.updated_at as string,
    sectionMeta: (data.section_meta as SectionMeta[] | null) ?? initialSectionMeta,
    data: (data.data as ResumeData | null) ?? initialResumeData,
  };
}

export async function createResumeAndRedirect(templateName?: string): Promise<never> {
  const { supabase, userId } = await requireUser();

  const resolvedTemplate = templates.some((t) => t.name === templateName)
    ? (templateName as string)
    : "Berlin";

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      title: "Neuer Lebenslauf",
      template_name: resolvedTemplate,
      section_meta: initialSectionMeta,
      data: initialResumeData,
    })
    .select("id")
    .single();

  if (error) throw error;

  redirect(`/editor/${data.id as string}`);
}
