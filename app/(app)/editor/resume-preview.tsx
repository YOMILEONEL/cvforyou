"use client";

import type { PersonalInfo, ResumeData, ResumeLanguage, SectionMeta } from "@/app/(app)/editor/types";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";
import { getSectionLabel, RESUME_UI_STRINGS } from "@/app/lib/resume-i18n";
import { templates } from "@/app/lib/templates";

type ResumePreviewProps = {
  resume: ResumeData;
  sections: SectionMeta[];
  templateName: string;
};

function SectionHeading({ children, dense }: { children: React.ReactNode; dense?: boolean }) {
  if (dense) {
    return (
      <h3 className="border-b border-ink/25 pb-1 text-sm font-semibold uppercase tracking-wide text-ink dark:border-ink-dark/25 dark:text-ink-dark">
        {children}
      </h3>
    );
  }
  return (
    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-rust">{children}</h3>
  );
}

function DescriptionText({ text, dense }: { text: string; dense?: boolean }) {
  if (!text) return null;
  if (dense) {
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    return (
      <ul className="mt-1 list-disc pl-4 text-sm leading-6 text-ink/80 dark:text-ink-dark/80">
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    );
  }
  return (
    <p className="mt-1 text-sm leading-6 text-ink/75 dark:text-ink-dark/75">{text}</p>
  );
}

function PreviewSection({
  section,
  resume,
  dense,
}: {
  section: SectionMeta;
  resume: ResumeData;
  dense?: boolean;
}) {
  const label = getSectionLabel(section.id, resume.language);
  const ui = RESUME_UI_STRINGS[resume.language];

  switch (section.id) {
    case "experience": {
      if (resume.experience.length === 0) return null;
      return (
        <section>
          <SectionHeading dense={dense}>{label}</SectionHeading>
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
                <DescriptionText text={item.description} dense={dense} />
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
          <SectionHeading dense={dense}>{label}</SectionHeading>
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
                  <p className="text-xs text-ink/50 dark:text-ink-dark/50">
                    {ui.grade}: {item.grade}
                  </p>
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
          <SectionHeading dense={dense}>{label}</SectionHeading>
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
          <SectionHeading dense={dense}>{label}</SectionHeading>
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
          <SectionHeading dense={dense}>{label}</SectionHeading>
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
          <SectionHeading dense={dense}>{label}</SectionHeading>
          <div className="mt-2 flex flex-col gap-3">
            {resume.projects.map((item) => (
              <div key={item.id}>
                <p className="font-serif text-base font-medium text-ink dark:text-ink-dark">
                  {item.title || "Projekt"}
                </p>
                <DescriptionText text={item.description} dense={dense} />
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
          <SectionHeading dense={dense}>{label}</SectionHeading>
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
          <SectionHeading dense={dense}>{resume.freitext.title || label}</SectionHeading>
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

function isResumeEmpty(resume: ResumeData): boolean {
  return (
    resume.experience.length === 0 &&
    resume.education.length === 0 &&
    resume.skills.length === 0 &&
    resume.languages.length === 0 &&
    resume.certificates.length === 0 &&
    resume.projects.length === 0 &&
    resume.references.length === 0 &&
    !resume.freitext.content
  );
}

function SectionsList({
  resume,
  sections,
  dense,
}: {
  resume: ResumeData;
  sections: SectionMeta[];
  dense?: boolean;
}) {
  const { dict } = useDictionary();

  return (
    <div className="flex flex-col gap-6">
      {sections
        .filter((section) => section.visible)
        .map((section) => (
          <PreviewSection key={section.id} section={section} resume={resume} dense={dense} />
        ))}

      {isResumeEmpty(resume) && (
        <p className="text-sm text-ink/40 dark:text-ink-dark/40">{dict.editor.emptyPreview}</p>
      )}
    </div>
  );
}

type LayoutProps = { resume: ResumeData; sections: SectionMeta[] };

function fullName(resume: ResumeData): string {
  return (
    [resume.personal.firstName, resume.personal.lastName].filter(Boolean).join(" ") ||
    "Dein Name"
  );
}

function formatGermanDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}

function birthLine(personal: PersonalInfo, language: ResumeLanguage): string {
  const ui = RESUME_UI_STRINGS[language];
  const date = personal.birthDate ? formatGermanDate(personal.birthDate) : "";
  if (date && personal.birthPlace) return `${ui.bornOn} ${date} ${ui.inConnector} ${personal.birthPlace}`;
  if (date) return `${ui.bornOn} ${date}`;
  if (personal.birthPlace) return `${ui.bornIn} ${personal.birthPlace}`;
  return "";
}

function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function personalLinks(
  personal: PersonalInfo,
  language: ResumeLanguage,
): { label: string; href?: string }[] {
  const ui = RESUME_UI_STRINGS[language];
  const items: { label: string; href?: string }[] = [];
  if (personal.linkedinUrl) items.push({ label: "LinkedIn", href: normalizeUrl(personal.linkedinUrl) });
  if (personal.githubUrl) items.push({ label: "GitHub", href: normalizeUrl(personal.githubUrl) });
  if (personal.portfolioUrl) items.push({ label: "Portfolio", href: normalizeUrl(personal.portfolioUrl) });
  if (personal.drivingLicense) items.push({ label: `${ui.drivingLicense} ${personal.drivingLicense}` });
  return items;
}

function LinksLine({
  personal,
  language,
  className,
  linkClassName,
}: {
  personal: PersonalInfo;
  language: ResumeLanguage;
  className: string;
  linkClassName: string;
}) {
  const items = personalLinks(personal, language);
  if (items.length === 0) return null;
  return (
    <p className={className}>
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 && " · "}
          {item.href ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              {item.label}
            </a>
          ) : (
            item.label
          )}
        </span>
      ))}
    </p>
  );
}

function PhotoCircle({ photoUrl, size = "h-14 w-14" }: { photoUrl: string; size?: string }) {
  if (!photoUrl) {
    return (
      <div className={`${size} flex-none rounded-full border border-dashed border-ink/25 dark:border-ink-dark/25`} />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={photoUrl} alt="" className={`${size} flex-none rounded-full object-cover`} />;
}

function MinimalistischLayout({ resume, sections }: LayoutProps) {
  const { personal, language } = resume;
  const ui = RESUME_UI_STRINGS[language];
  return (
    <div className="relative w-full max-w-md -rotate-1">
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
        <header className="flex items-center gap-4 border-b border-ink/15 pb-4 dark:border-ink-dark/15">
          {personal.photoUrl && <PhotoCircle photoUrl={personal.photoUrl} />}
          <div>
            <h2 className="font-serif text-2xl font-medium text-ink dark:text-ink-dark">
              {fullName(resume)}
            </h2>
            {personal.title && <p className="text-sm text-rust">{personal.title}</p>}
            <p className="mt-2 font-mono text-xs text-ink/60 dark:text-ink-dark/60">
              {[personal.email, personal.phone, personal.city, birthLine(personal, language)]
                .filter(Boolean)
                .join(" · ") || ui.contactPlaceholder}
            </p>
            <LinksLine
              personal={personal}
              language={language}
              className="mt-1 font-mono text-xs text-ink/50 dark:text-ink-dark/50"
              linkClassName="text-rust hover:underline"
            />
          </div>
        </header>

        <div className="mt-6">
          <SectionsList resume={resume} sections={sections} />
        </div>
      </div>
    </div>
  );
}

function ModernLayout({ resume, sections }: LayoutProps) {
  const { personal, language } = resume;
  const ui = RESUME_UI_STRINGS[language];
  return (
    <div className="relative w-full max-w-md rotate-1">
      <div className="flex border border-ink bg-sheet shadow-[8px_8px_0_0_var(--color-forest)] dark:border-ink-dark/60 dark:bg-sheet-dark">
        <aside className="w-1/3 flex-none border-r border-ink/15 bg-forest/10 p-5 dark:border-ink-dark/15">
          <PhotoCircle photoUrl={personal.photoUrl} size="h-14 w-14" />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-forest">
            {ui.contactHeading}
          </p>
          <div className="mt-2 flex flex-col gap-1 font-mono text-[11px] text-ink/70 dark:text-ink-dark/70">
            <span>{personal.email || "E-Mail"}</span>
            <span>{personal.phone || "Telefon"}</span>
            <span>{personal.city || "Ort"}</span>
            {birthLine(personal, language) && <span>{birthLine(personal, language)}</span>}
          </div>
          {personalLinks(personal, language).length > 0 && (
            <div className="mt-4 flex flex-col gap-1 font-mono text-[11px] text-forest">
              {personalLinks(personal, language).map((item) =>
                item.href ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.label}
                  </a>
                ) : (
                  <span key={item.label}>{item.label}</span>
                ),
              )}
            </div>
          )}
        </aside>
        <div className="flex-1 p-6">
          <h2 className="font-serif text-2xl font-medium text-ink dark:text-ink-dark">
            {fullName(resume)}
          </h2>
          {personal.title && <p className="text-sm text-forest">{personal.title}</p>}
          <div className="mt-6">
            <SectionsList resume={resume} sections={sections} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KreativLayout({ resume, sections }: LayoutProps) {
  const { personal, language } = resume;
  const ui = RESUME_UI_STRINGS[language];
  return (
    <div className="relative w-full max-w-md -rotate-2">
      <div className="overflow-hidden border border-ink bg-sheet shadow-[8px_8px_0_0_var(--color-rust)] dark:border-ink-dark/60 dark:bg-sheet-dark">
        <header className="flex items-center gap-4 bg-rust px-8 py-6 text-paper">
          {personal.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={personal.photoUrl}
              alt=""
              className="h-14 w-14 flex-none rounded-full border-2 border-paper/60 object-cover"
            />
          )}
          <div>
            <h2 className="font-serif text-2xl font-medium">{fullName(resume)}</h2>
            {personal.title && <p className="text-sm text-paper/80">{personal.title}</p>}
            <p className="mt-2 font-mono text-xs text-paper/70">
              {[personal.email, personal.phone, personal.city, birthLine(personal, language)]
                .filter(Boolean)
                .join(" · ") || ui.contactPlaceholder}
            </p>
            <LinksLine
              personal={personal}
              language={language}
              className="mt-1 font-mono text-xs text-paper/70"
              linkClassName="underline hover:text-paper"
            />
          </div>
        </header>
        <div className="p-8">
          <SectionsList resume={resume} sections={sections} />
        </div>
      </div>
    </div>
  );
}

function KlassischLayout({ resume, sections }: LayoutProps) {
  const { personal, language } = resume;
  const ui = RESUME_UI_STRINGS[language];
  return (
    <div className="relative w-full max-w-md">
      <div className="border border-ink bg-sheet p-8 shadow-[8px_8px_0_0_var(--color-ochre)] dark:border-ink-dark/60 dark:bg-sheet-dark">
        <header className="border-b border-ink/20 pb-4 text-center dark:border-ink-dark/20">
          <h2 className="font-serif text-2xl font-semibold text-ink dark:text-ink-dark">
            {fullName(resume)}
          </h2>
          {personal.title && <p className="text-sm text-ochre">{personal.title}</p>}
          <p className="mt-2 text-xs text-ink/60 dark:text-ink-dark/60">
            {[personal.city, personal.phone, personal.email, birthLine(personal, language)]
              .filter(Boolean)
              .join(" | ") || ui.klassischContactPlaceholder}
          </p>
          <LinksLine
            personal={personal}
            language={language}
            className="mt-1 text-xs text-ink/60 dark:text-ink-dark/60"
            linkClassName="text-ochre hover:underline"
          />
        </header>

        <div className="mt-6">
          <SectionsList resume={resume} sections={sections} dense />
        </div>
      </div>
    </div>
  );
}

export function ResumePreview({ resume, sections, templateName }: ResumePreviewProps) {
  const style = templates.find((t) => t.name === templateName)?.style ?? "Minimalistisch";

  if (style === "Modern") {
    return <ModernLayout resume={resume} sections={sections} />;
  }
  if (style === "Kreativ") {
    return <KreativLayout resume={resume} sections={sections} />;
  }
  if (style === "Klassisch") {
    return <KlassischLayout resume={resume} sections={sections} />;
  }
  return <MinimalistischLayout resume={resume} sections={sections} />;
}
