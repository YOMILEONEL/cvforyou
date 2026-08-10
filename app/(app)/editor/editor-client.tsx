"use client";

import { useEffect, useRef, useState } from "react";

import { JobMatchPanel } from "@/app/(app)/editor/job-match-panel";
import { LanguageToggle } from "@/app/(app)/editor/language-toggle";
import { ResumePreview } from "@/app/(app)/editor/resume-preview";
import { SectionForm } from "@/app/(app)/editor/section-form";
import { SectionNav } from "@/app/(app)/editor/section-nav";
import { TemplatePicker } from "@/app/(app)/editor/template-picker";
import {
  SECTION_LABELS,
  type EditorSection,
  type ResumeData,
  type ResumeLanguage,
  type SectionId,
  type SectionMeta,
} from "@/app/(app)/editor/types";
import { saveResume } from "@/app/lib/resume-actions";
import { RESUME_UI_STRINGS } from "@/app/lib/resume-i18n";

type EditorClientProps = {
  resumeId: string;
  initialTitle: string;
  initialTemplateName: string;
  initialResume: ResumeData;
  initialSections: SectionMeta[];
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

const SAVE_STATUS_LABEL: Record<SaveStatus, string> = {
  idle: "",
  saving: "Speichert …",
  saved: "Gespeichert",
  error: "Fehler beim Speichern",
};

export function EditorClient({
  resumeId,
  initialTitle,
  initialTemplateName,
  initialResume,
  initialSections,
}: EditorClientProps) {
  const [title, setTitle] = useState(initialTitle);
  const [templateName, setTemplateName] = useState(initialTemplateName);
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [sections, setSections] = useState<SectionMeta[]>(initialSections);
  const [activeSection, setActiveSection] = useState<EditorSection>("personal");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isDirty, setIsDirty] = useState(false);

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setIsDirty(true);
    const timeout = setTimeout(() => {
      setSaveStatus("saving");
      saveResume(resumeId, { title, templateName, data: resume, sectionMeta: sections })
        .then((result) => {
          setSaveStatus(result.error ? "error" : "saved");
          if (!result.error) setIsDirty(false);
        })
        .catch(() => setSaveStatus("error"));
    }, 1200);

    return () => clearTimeout(timeout);
  }, [resumeId, title, templateName, resume, sections]);

  function updateResume(patch: Partial<ResumeData>) {
    setResume((prev) => ({ ...prev, ...patch }));
  }

  function toggleVisible(id: SectionId) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, visible: !section.visible } : section,
      ),
    );
  }

  function handleLanguageChange(nextLanguage: ResumeLanguage) {
    // Swap the freitext heading between the two languages' defaults, but
    // only if it still matches a default — never overwrite a custom title.
    const currentDefault = RESUME_UI_STRINGS[resume.language].freitextDefaultTitle;
    const nextDefault = RESUME_UI_STRINGS[nextLanguage].freitextDefaultTitle;
    const shouldSwapTitle = resume.freitext.title === "" || resume.freitext.title === currentDefault;

    updateResume({
      language: nextLanguage,
      freitext: shouldSwapTitle ? { ...resume.freitext, title: nextDefault } : resume.freitext,
    });
  }

  const activeLabel =
    activeSection === "personal"
      ? "Persönliche Daten"
      : activeSection === "design"
        ? "Vorlage"
        : activeSection === "match"
          ? "Stellenabgleich"
          : SECTION_LABELS[activeSection];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-dashed border-ink/20 pb-4 sm:flex-row sm:items-center dark:border-ink-dark/20">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Titel des Lebenslaufs"
          className="w-full max-w-sm border-b border-dashed border-ink/30 bg-transparent pb-1 font-serif text-2xl font-medium text-ink outline-none focus:border-rust sm:w-auto dark:border-ink-dark/30 dark:text-ink-dark"
        />
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink/40 dark:text-ink-dark/40">
            {SAVE_STATUS_LABEL[saveStatus]}
          </span>
          {isDirty ? (
            <button
              type="button"
              disabled
              title="Warte, bis deine Änderungen gespeichert sind."
              className="cursor-not-allowed border border-ink/20 px-3 py-1.5 text-xs font-medium text-ink/40 dark:border-ink-dark/20 dark:text-ink-dark/40"
            >
              Als PDF exportieren
            </button>
          ) : (
            <a
              href={`/api/resumes/${resumeId}/pdf`}
              className="border border-ink px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink hover:text-paper dark:border-ink-dark/60 dark:text-ink-dark dark:hover:bg-ink-dark dark:hover:text-paper-dark"
            >
              Als PDF exportieren
            </a>
          )}
        </div>
      </div>

      <div className="grid flex-1 gap-8 lg:grid-cols-[220px_1fr_420px]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SectionNav
            sections={sections}
            activeSection={activeSection}
            onSelect={setActiveSection}
            onToggleVisible={toggleVisible}
            onReorder={setSections}
          />
        </aside>

        <div className="flex flex-col gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
              Bearbeiten
            </span>
            <h1 className="mt-1 font-serif text-2xl font-medium text-ink dark:text-ink-dark">
              {activeLabel}
            </h1>
          </div>
          {activeSection === "design" ? (
            <div className="flex flex-col gap-8">
              <LanguageToggle language={resume.language} onChange={handleLanguageChange} />
              <TemplatePicker activeTemplate={templateName} onSelect={setTemplateName} />
            </div>
          ) : activeSection === "match" ? (
            <JobMatchPanel resume={resume} />
          ) : (
            <SectionForm
              activeSection={activeSection}
              resume={resume}
              resumeId={resumeId}
              onChange={updateResume}
            />
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="mb-4 block font-mono text-xs uppercase tracking-[0.2em] text-ink/50 dark:text-ink-dark/50">
            Live-Vorschau
          </span>
          <ResumePreview resume={resume} sections={sections} templateName={templateName} />
        </div>
      </div>
    </div>
  );
}
