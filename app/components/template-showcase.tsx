import Link from "next/link";

import { TemplatePreview } from "@/app/components/template-preview";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";
import { templates } from "@/app/lib/templates";

// Small alternating tilt so the grid reads like scattered pages on a desk.
const tilts = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "-rotate-1", "rotate-1"];

export async function TemplateShowcase() {
  const dict = await getDictionary();
  const teaser = templates.slice(0, 6);

  return (
    <section id="templates" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
          {dict.templatesSection.eyebrow}
        </span>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl dark:text-ink-dark">
          {dict.templatesSection.title}
        </h2>
        <p className="mt-4 text-lg text-ink/70 dark:text-ink-dark/70">
          {dict.templatesSection.subtitle}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {teaser.map((template, index) => (
          <div
            key={template.name}
            className={`group flex flex-col gap-4 border border-ink bg-sheet p-3 shadow-[5px_5px_0_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-0 hover:shadow-[7px_7px_0_0_var(--color-ink)] ${tilts[index % tilts.length]} dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[5px_5px_0_0_var(--color-ink-dark)] dark:hover:shadow-[7px_7px_0_0_var(--color-ink-dark)]`}
          >
            <div className="relative">
              <TemplatePreview template={template} />
              {template.badge && (
                <span className="absolute -left-1 -top-1 flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-full border border-dashed border-rust bg-sheet text-center font-mono text-[8px] font-semibold uppercase leading-tight text-rust dark:bg-sheet-dark">
                  {dict.templatesSection.badges[template.badge]}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between px-1 pb-1">
              <div>
                <p className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                  {template.name}
                </p>
                <p className="font-mono text-xs uppercase tracking-wide text-ink/50 dark:text-ink-dark/50">
                  {dict.editor.design.styleNames[template.style]}
                </p>
              </div>
              <Link
                href={`/editor?template=${encodeURIComponent(template.name)}`}
                className="border border-ink px-3 py-1.5 text-sm font-medium text-ink opacity-0 transition-opacity group-hover:opacity-100 dark:border-ink-dark/60 dark:text-ink-dark"
              >
                {dict.templatesSection.select}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/vorlagen"
          className="font-medium text-ink underline decoration-dashed decoration-ink/40 underline-offset-4 hover:decoration-ink dark:text-ink-dark dark:decoration-ink-dark/40"
        >
          {dict.templatesSection.viewAll}
        </Link>
      </div>
    </section>
  );
}
