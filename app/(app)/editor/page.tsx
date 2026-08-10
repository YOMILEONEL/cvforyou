import { createResumeAndRedirect } from "@/app/lib/resumes";

type EditorEntryPageProps = {
  searchParams: Promise<{ template?: string }>;
};

export default async function EditorEntryPage({ searchParams }: EditorEntryPageProps) {
  const { template } = await searchParams;
  await createResumeAndRedirect(template);
}
