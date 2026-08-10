import type { ResumeData, SectionMeta } from "@/app/(app)/editor/types";

type ResumePreviewProps = {
  resume: ResumeData;
  sections: SectionMeta[];
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-rust">{children}</h3>
  );
}

function PreviewSection({ section, resume }: { section: SectionMeta; resume: ResumeData }) {
  switch (section.id) {
    case "experience": {
      if (resume.experience.length === 0) return null;
      return (
        <section>
          <SectionHeading>{section.label}</SectionHeading>
          <div className="mt-2 flex flex-col gap-3">
            {resume.experience.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-serif text-base font-medium text-ink dark:text-ink-dark">
                    {item.position || "Position"}
                    {item.company && ` · ${item.company}`}
                  </p>
                  <p className="whitespace-nowrap font-mono text-[11px] text-ink/50 dark:text-ink-dark/50">
                    {[item.from, item.to].filter(Boolean).join(" – ")}
                  </p>
                </div>
                {item.location && (
                  <p className="text-xs text-ink/50 dark:text-ink-dark/50">{item.location}</p>
                )}
                {item.description && (
                  <p className="mt-1 text-sm leading-6 text-ink/75 dark:text-ink-dark/75">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    }
    case "education": {
      if (resume.education.length === 0) return null;
      return (
        <section>
          <SectionHeading>{section.label}</SectionHeading>
          <div className="mt-2 flex flex-col gap-3">
            {resume.education.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-serif text-base font-medium text-ink dark:text-ink-dark">
                    {item.degree || "Abschluss"}
                    {item.institution && ` · ${item.institution}`}
                  </p>
                  <p className="whitespace-nowrap font-mono text-[11px] text-ink/50 dark:text-ink-dark/50">
                    {[item.from, item.to].filter(Boolean).join(" – ")}
                  </p>
                </div>
                {item.grade && (
                  <p className="text-xs text-ink/50 dark:text-ink-dark/50">Note: {item.grade}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    }
    case "skills": {
      if (resume.skills.length === 0) return null;
      return (
        <section>
          <SectionHeading>{section.label}</SectionHeading>
          <div className="mt-2 flex flex-wrap gap-2">
            {resume.skills.map((item) => (
              <span
                key={item.id}
                className="border border-ink/20 px-2 py-1 font-mono text-[11px] text-ink/80 dark:border-ink-dark/20 dark:text-ink-dark/80"
              >
                {item.name || "Fähigkeit"} {"●".repeat(item.level)}
                {"○".repeat(5 - item.level)}
              </span>
            ))}
          </div>
        </section>
      );
    }
    case "languages": {
      if (resume.languages.length === 0) return null;
      return (
        <section>
          <SectionHeading>{section.label}</SectionHeading>
          <div className="mt-2 flex flex-wrap gap-2">
            {resume.languages.map((item) => (
              <span
                key={item.id}
                className="border border-ink/20 px-2 py-1 font-mono text-[11px] text-ink/80 dark:border-ink-dark/20 dark:text-ink-dark/80"
              >
                {item.name || "Sprache"} · {item.level}
              </span>
            ))}
          </div>
        </section>
      );
    }
    case "certificates": {
      if (resume.certificates.length === 0) return null;
      return (
        <section>
          <SectionHeading>{section.label}</SectionHeading>
          <div className="mt-2 flex flex-col gap-2">
            {resume.certificates.map((item) => (
              <div key={item.id} className="flex items-baseline justify-between gap-2">
                <p className="text-sm text-ink dark:text-ink-dark">
                  {item.title || "Zertifikat"}
                  {item.issuer && ` · ${item.issuer}`}
                </p>
                <p className="whitespace-nowrap font-mono text-[11px] text-ink/50 dark:text-ink-dark/50">
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        </section>
      );
    }
    case "projects": {
      if (resume.projects.length === 0) return null;
      return (
        <section>
          <SectionHeading>{section.label}</SectionHeading>
          <div className="mt-2 flex flex-col gap-3">
            {resume.projects.map((item) => (
              <div key={item.id}>
                <p className="font-serif text-base font-medium text-ink dark:text-ink-dark">
                  {item.title || "Projekt"}
                </p>
                {item.description && (
                  <p className="mt-1 text-sm leading-6 text-ink/75 dark:text-ink-dark/75">
                    {item.description}
                  </p>
                )}
                {item.link && <p className="text-xs text-rust">{item.link}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    }
    case "references": {
      if (resume.references.length === 0) return null;
      return (
        <section>
          <SectionHeading>{section.label}</SectionHeading>
          <div className="mt-2 flex flex-col gap-2">
            {resume.references.map((item) => (
              <p key={item.id} className="text-sm text-ink/80 dark:text-ink-dark/80">
                {item.name || "Name"}
                {item.role && ` — ${item.role}`}
                {item.contact && ` · ${item.contact}`}
              </p>
            ))}
          </div>
        </section>
      );
    }
    case "freitext": {
      if (!resume.freitext.content) return null;
      return (
        <section>
          <SectionHeading>{resume.freitext.title || section.label}</SectionHeading>
          <p className="mt-2 text-sm leading-6 text-ink/75 dark:text-ink-dark/75">
            {resume.freitext.content}
          </p>
        </section>
      );
    }
    default:
      return null;
  }
}

export function ResumePreview({ resume, sections }: ResumePreviewProps) {
  const { personal } = resume;
  const fullName =
    [personal.firstName, personal.lastName].filter(Boolean).join(" ") || "Dein Name";

  const isEmpty =
    resume.experience.length === 0 &&
    resume.education.length === 0 &&
    resume.skills.length === 0 &&
    resume.languages.length === 0 &&
    resume.certificates.length === 0 &&
    resume.projects.length === 0 &&
    resume.references.length === 0 &&
    !resume.freitext.content;

  return (
    <div className="relative mx-auto w-full max-w-md -rotate-1">
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 z-10 h-0 w-0 border-t-[22px] border-l-[22px] border-t-ink/15 border-l-transparent dark:border-t-ink-dark/15"
      />
      <div
        className="relative border border-ink bg-sheet p-8 shadow-[8px_8px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[8px_8px_0_0_var(--color-ink-dark)]"
        style={{
          clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
        }}
      >
        <header className="border-b border-ink/15 pb-4 dark:border-ink-dark/15">
          <h2 className="font-serif text-2xl font-medium text-ink dark:text-ink-dark">
            {fullName}
          </h2>
          {personal.title && <p className="text-sm text-rust">{personal.title}</p>}
          <p className="mt-2 font-mono text-xs text-ink/60 dark:text-ink-dark/60">
            {[personal.email, personal.phone, personal.city].filter(Boolean).join(" · ") ||
              "E-Mail · Telefon · Ort"}
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-6">
          {sections
            .filter((section) => section.visible)
            .map((section) => (
              <PreviewSection key={section.id} section={section} resume={resume} />
            ))}

          {isEmpty && (
            <p className="text-sm text-ink/40 dark:text-ink-dark/40">
              Deine Eingaben erscheinen hier live, sobald du links Daten einträgst.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
