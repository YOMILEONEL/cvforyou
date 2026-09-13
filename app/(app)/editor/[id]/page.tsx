import type { Metadata } from "next";

import { EditorClient } from "@/app/(app)/editor/editor-client";
import { getJobMatchUsedToday, getResumeMatches } from "@/app/lib/match-actions";
import { getResume } from "@/app/lib/resumes";

export const metadata: Metadata = {
  title: "Editor – CVforYou",
};

type EditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;
  const [resume, jobMatchUsedToday, jobMatches] = await Promise.all([
    getResume(id),
    getJobMatchUsedToday(),
    getResumeMatches(id),
  ]);

  return (
    <EditorClient
      resumeId={resume.id}
      initialTitle={resume.title}
      initialTemplateName={resume.templateName}
      initialResume={resume.data}
      initialSections={resume.sectionMeta}
      jobMatchUsedToday={jobMatchUsedToday}
      initialJobMatches={jobMatches}
    />
  );
}
