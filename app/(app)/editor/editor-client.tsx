"use client";

import { useState } from "react";

import { ResumePreview } from "@/app/(app)/editor/resume-preview";
import { SectionForm } from "@/app/(app)/editor/section-form";
import { SectionNav } from "@/app/(app)/editor/section-nav";
import {
  SECTION_LABELS,
  initialResumeData,
  initialSectionMeta,
  type EditorSection,
  type ResumeData,
  type SectionId,
  type SectionMeta,
} from "@/app/(app)/editor/types";

export function EditorClient() {
  const [resume, setResume] = useState<ResumeData>(initialResumeData);
  const [sections, setSections] = useState<SectionMeta[]>(initialSectionMeta);
  const [activeSection, setActiveSection] = useState<EditorSection>("personal");

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
    <div className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-6 py-10 lg:grid-cols-[220px_1fr_420px]">
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
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50 dark:text-ink-dark/50">
            Live-Vorschau
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
        <ResumePreview resume={resume} sections={sections} />
      </div>
    </div>
  );
}
