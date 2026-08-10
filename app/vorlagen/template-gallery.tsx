"use client";

import { useState } from "react";
import Link from "next/link";

import { TemplatePreview } from "@/app/components/template-preview";
import { templates, type TemplateStyle } from "@/app/lib/templates";

const filters: Array<TemplateStyle | "Alle"> = [
  "Alle",
  "Minimalistisch",
  "Modern",
  "Kreativ",
];

const tilts = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "-rotate-1", "rotate-1"];

export function TemplateGallery() {
  const [active, setActive] = useState<TemplateStyle | "Alle">("Alle");
  const visible =
    active === "Alle" ? templates : templates.filter((t) => t.style === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={`border px-4 py-1.5 text-sm font-medium transition-colors ${
              active === filter
                ? "border-ink bg-ink text-paper dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
                : "border-ink/30 text-ink/70 hover:border-ink dark:border-ink-dark/30 dark:text-ink-dark/70 dark:hover:border-ink-dark"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((template, index) => (
          <div
            key={template.name}
            className={`group flex flex-col gap-4 border border-ink bg-sheet p-3 shadow-[5px_5px_0_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-0 hover:shadow-[7px_7px_0_0_var(--color-ink)] ${tilts[index % tilts.length]} dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[5px_5px_0_0_var(--color-ink-dark)] dark:hover:shadow-[7px_7px_0_0_var(--color-ink-dark)]`}
          >
            <div className="relative">
              <TemplatePreview template={template} />
              {template.badge && (
                <span className="absolute -left-1 -top-1 flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-full border border-dashed border-rust bg-sheet text-center font-mono text-[8px] font-semibold uppercase leading-tight text-rust dark:bg-sheet-dark">
                  {template.badge}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between px-1 pb-1">
              <div>
                <p className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                  {template.name}
                </p>
                <p className="font-mono text-xs uppercase tracking-wide text-ink/50 dark:text-ink-dark/50">
                  {template.style}
                </p>
              </div>
              <Link
                href="/editor"
                className="border border-ink px-3 py-1.5 text-sm font-medium text-ink opacity-0 transition-opacity group-hover:opacity-100 dark:border-ink-dark/60 dark:text-ink-dark"
              >
                Auswählen
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
