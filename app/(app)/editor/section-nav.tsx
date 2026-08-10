"use client";

import { useState } from "react";

import { initialSectionMeta, type EditorSection, type SectionId, type SectionMeta } from "@/app/(app)/editor/types";
import { RobotIcon } from "@/app/components/robot-icon";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";

type SectionNavProps = {
  sections: SectionMeta[];
  activeSection: EditorSection;
  onSelect: (id: EditorSection) => void;
  onToggleVisible: (id: SectionId) => void;
  onReorder: (nextOrder: SectionMeta[]) => void;
};

export function SectionNav({
  sections,
  activeSection,
  onSelect,
  onToggleVisible,
  onReorder,
}: SectionNavProps) {
  const [dragId, setDragId] = useState<SectionId | null>(null);
  const { dict } = useDictionary();
  const t = dict.editor.nav;

  function handleDrop(targetId: SectionId) {
    if (!dragId || dragId === targetId) return;
    const next = [...sections];
    const fromIndex = next.findIndex((s) => s.id === dragId);
    const toIndex = next.findIndex((s) => s.id === targetId);
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onReorder(next);
    setDragId(null);
  }

  function resetOrder() {
    const visibilityById = new Map(sections.map((section) => [section.id, section.visible]));
    onReorder(
      initialSectionMeta.map((section) => ({
        ...section,
        visible: visibilityById.get(section.id) ?? section.visible,
      })),
    );
  }

  return (
    <nav aria-label={t.sectionsAriaLabel} className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onSelect("personal")}
        className={`flex items-center gap-2 border px-3 py-2 text-left text-sm font-medium transition-colors ${
          activeSection === "personal"
            ? "border-ink bg-ink text-paper dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
            : "border-ink/20 text-ink/80 hover:border-ink/50 dark:border-ink-dark/20 dark:text-ink-dark/80"
        }`}
      >
        {t.personalData}
        <span className="ml-auto font-mono text-[10px] uppercase text-current/60">
          {t.fixed}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelect("design")}
        className={`flex items-center gap-2 border px-3 py-2 text-left text-sm font-medium transition-colors ${
          activeSection === "design"
            ? "border-ink bg-ink text-paper dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
            : "border-ink/20 text-ink/80 hover:border-ink/50 dark:border-ink-dark/20 dark:text-ink-dark/80"
        }`}
      >
        {t.design}
        <span className="ml-auto font-mono text-[10px] uppercase text-current/60">
          {t.fixed}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelect("match")}
        className={`flex items-center gap-2 border px-3 py-2 text-left text-sm font-medium transition-colors ${
          activeSection === "match"
            ? "border-ink bg-ink text-paper dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
            : "border-ink/20 text-ink/80 hover:border-ink/50 dark:border-ink-dark/20 dark:text-ink-dark/80"
        }`}
      >
        <RobotIcon className="h-4 w-4 flex-none text-rust" />
        {t.jobMatch}
        <span className="ml-auto font-mono text-[10px] uppercase text-current/60">
          {t.fixed}
        </span>
      </button>

      <div
        aria-hidden="true"
        className="my-1 h-px border-t border-dashed border-ink/20 dark:border-ink-dark/20"
      />

      <ul className="flex flex-col gap-2">
        {sections.map((section) => (
          <li
            key={section.id}
            draggable
            onDragStart={() => setDragId(section.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(section.id)}
            className={`flex items-center gap-2 border px-3 py-2 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "border-ink bg-ink text-paper dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
                : "border-ink/20 text-ink/80 hover:border-ink/50 dark:border-ink-dark/20 dark:text-ink-dark/80"
            } ${section.visible ? "" : "opacity-50"}`}
          >
            <span aria-hidden="true" className="cursor-grab select-none text-current/40">
              ⠿
            </span>
            <button
              type="button"
              onClick={() => onSelect(section.id)}
              className="flex-1 text-left"
            >
              {t.sectionNames[section.id]}
            </button>
            <button
              type="button"
              onClick={() => onToggleVisible(section.id)}
              aria-label={section.visible ? t.hideSection : t.showSection}
              className="text-current/60 hover:text-current"
            >
              {section.visible ? "◎" : "◌"}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={resetOrder}
        className="mt-1 self-start text-xs text-ink/50 underline decoration-dashed decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink dark:text-ink-dark/50 dark:decoration-ink-dark/30 dark:hover:text-ink-dark"
      >
        {t.resetOrder}
      </button>
    </nav>
  );
}
