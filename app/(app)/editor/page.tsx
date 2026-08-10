import { createResumeAndRedirect } from "@/app/lib/resumes";

export default async function EditorEntryPage() {
  await createResumeAndRedirect();
}
