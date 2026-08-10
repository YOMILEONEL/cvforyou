import type { Metadata } from "next";

import { EditorClient } from "@/app/(app)/editor/editor-client";
import { getResume } from "@/app/lib/resumes";

export const metadata: Metadata = {
  title: "Editor – CVio",
};

type EditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;
  const resume = await getResume(id);

  return (
    <EditorClient
      resumeId={resume.id}
      initialTitle={resume.title}
      initialResume={resume.data}
      initialSections={resume.sectionMeta}
    />
  );
}
