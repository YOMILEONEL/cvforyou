"use client";

import { useState } from "react";

import type { EditorSection, SectionId, SectionMeta } from "@/app/(app)/editor/types";

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

  return (
    <nav aria-label="Sektionen" className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onSelect("personal")}
        className={`flex items-center gap-2 border px-3 py-2 text-left text-sm font-medium transition-colors ${
          activeSection === "personal"
            ? "border-ink bg-ink text-paper dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
            : "border-ink/20 text-ink/80 hover:border-ink/50 dark:border-ink-dark/20 dark:text-ink-dark/80"
        }`}
      >
        Persönliche Daten
        <span className="ml-auto font-mono text-[10px] uppercase text-current/60">
          fix
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
              {section.label}
            </button>
            <button
              type="button"
              onClick={() => onToggleVisible(section.id)}
              aria-label={section.visible ? "Sektion ausblenden" : "Sektion einblenden"}
              className="text-current/60 hover:text-current"
            >
              {section.visible ? "◎" : "◌"}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
