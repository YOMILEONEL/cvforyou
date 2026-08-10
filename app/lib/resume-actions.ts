"use server";

import { revalidatePath } from "next/cache";

import type { ResumeData, SectionMeta } from "@/app/(app)/editor/types";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";
import { createClient } from "@/app/lib/supabase/server";

export type SaveResumeResult = { error?: string; savedAt?: string };

export async function saveResume(
  id: string,
  patch: { title: string; templateName: string; data: ResumeData; sectionMeta: SectionMeta[] },
): Promise<SaveResumeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const dict = await getDictionary();

  if (!user) {
    return { error: dict.common.notAuthenticated };
  }

  const { error } = await supabase
    .from("resumes")
    .update({
      title: patch.title || "Neuer Lebenslauf",
      template_name: patch.templateName,
      data: patch.data,
      section_meta: patch.sectionMeta,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: dict.common.saveFailed };
  }

  revalidatePath("/dashboard");
  return { savedAt: new Date().toISOString() };
}

export async function deleteResume(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("resumes").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}
