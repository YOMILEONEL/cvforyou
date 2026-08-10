import type { Metadata } from "next";
import Link from "next/link";

import { TemplatePreview } from "@/app/components/template-preview";
import { templates } from "@/app/lib/templates";
import { deleteResume } from "@/app/lib/resume-actions";
import { listResumes } from "@/app/lib/resumes";

export const metadata: Metadata = {
  title: "Meine Lebensläufe – CVio",
};

function formatRelativeTime(iso: string): string {
  const diffMinutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMinutes < 1) return "gerade eben";
  if (diffMinutes < 60) return `vor ${diffMinutes} Min.`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  const diffDays = Math.round(diffHours / 24);
  return `vor ${diffDays} Tag${diffDays === 1 ? "" : "en"}`;
}

export default async function DashboardPage() {
  const resumes = await listResumes();

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
            Übersicht
          </span>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl dark:text-ink-dark">
            Meine Lebensläufe
          </h1>
        </div>
        <Link
          href="/editor"
          className="flex h-11 items-center justify-center border border-ink bg-ink px-5 text-sm font-semibold text-paper shadow-[3px_3px_0_0_var(--color-rust)] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
        >
          + Neuer Lebenslauf
        </Link>
      </div>

      {resumes.length === 0 ? (
        <p className="mt-12 border border-dashed border-ink/25 p-8 text-center text-sm text-ink/60 dark:border-ink-dark/25 dark:text-ink-dark/60">
          Noch keine Lebensläufe — leg mit „+ Neuer Lebenslauf&rdquo; deinen ersten an.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => {
            const template = templates.find((t) => t.name === resume.templateName) ?? templates[0];
            return (
              <div
                key={resume.id}
                className="flex flex-col gap-4 border border-ink bg-sheet p-3 shadow-[5px_5px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[5px_5px_0_0_var(--color-ink-dark)]"
              >
                <TemplatePreview template={template} />
                <div className="flex items-center justify-between px-1 pb-1">
                  <div>
                    <p className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                      {resume.title}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-wide text-ink/50 dark:text-ink-dark/50">
                      {template.name} · {formatRelativeTime(resume.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/editor/${resume.id}`}
                      className="border border-ink px-3 py-1.5 text-sm font-medium text-ink dark:border-ink-dark/60 dark:text-ink-dark"
                    >
                      Bearbeiten
                    </Link>
                    <form action={deleteResume.bind(null, resume.id)}>
                      <button type="submit" className="text-sm text-rust hover:underline">
                        Löschen
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href="/editor"
            className="flex min-h-[220px] flex-col items-center justify-center gap-2 border-2 border-dashed border-ink/25 p-6 text-center text-ink/50 transition-colors hover:border-rust hover:text-rust dark:border-ink-dark/25 dark:text-ink-dark/50"
          >
            <span className="text-3xl">+</span>
            <span className="text-sm font-medium">Neuen Lebenslauf erstellen</span>
          </Link>
        </div>
      )}
    </section>
  );
}
