"use client";

import { useEffect, useRef, useState } from "react";

import { ResumePreview } from "@/app/(app)/editor/resume-preview";
import { SectionForm } from "@/app/(app)/editor/section-form";
import { SectionNav } from "@/app/(app)/editor/section-nav";
import {
  SECTION_LABELS,
  type EditorSection,
  type ResumeData,
  type SectionId,
  type SectionMeta,
} from "@/app/(app)/editor/types";
import { saveResume } from "@/app/lib/resume-actions";

type EditorClientProps = {
  resumeId: string;
  initialTitle: string;
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
  initialResume,
  initialSections,
}: EditorClientProps) {
  const [title, setTitle] = useState(initialTitle);
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [sections, setSections] = useState<SectionMeta[]>(initialSections);
  const [activeSection, setActiveSection] = useState<EditorSection>("personal");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      setSaveStatus("saving");
      saveResume(resumeId, { title, data: resume, sectionMeta: sections })
        .then((result) => setSaveStatus(result.error ? "error" : "saved"))
        .catch(() => setSaveStatus("error"));
    }, 1200);

    return () => clearTimeout(timeout);
  }, [resumeId, title, resume, sections]);

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

  const activeLabel =
    activeSection === "personal" ? "Persönliche Daten" : SECTION_LABELS[activeSection];

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
          <button
            type="button"
            disabled
            title="PDF-Export folgt, sobald der Export-Baustein angebunden ist."
            className="cursor-not-allowed border border-ink/20 px-3 py-1.5 text-xs font-medium text-ink/40 dark:border-ink-dark/20 dark:text-ink-dark/40"
          >
            Als PDF exportieren
          </button>
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
          <SectionForm activeSection={activeSection} resume={resume} onChange={updateResume} />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="mb-4 block font-mono text-xs uppercase tracking-[0.2em] text-ink/50 dark:text-ink-dark/50">
            Live-Vorschau
          </span>
          <ResumePreview resume={resume} sections={sections} />
        </div>
      </div>
    </div>
  );
}
