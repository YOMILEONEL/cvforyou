"use client";

import { TemplatePreview } from "@/app/components/template-preview";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";
import { templates } from "@/app/lib/templates";

type TemplatePickerProps = {
  activeTemplate: string;
  onSelect: (name: string) => void;
};

export function TemplatePicker({ activeTemplate, onSelect }: TemplatePickerProps) {
  const { dict } = useDictionary();
  const t = dict.editor.design;

  return (
    <div>
      <p className="mb-4 text-sm text-ink/70 dark:text-ink-dark/70">{t.templatePickerIntro}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {templates.map((template) => {
          const isActive = template.name === activeTemplate;
          return (
            <button
              key={template.name}
              type="button"
              onClick={() => onSelect(template.name)}
              className={`flex flex-col gap-2 border p-2 text-left transition-colors ${
                isActive
                  ? "border-rust shadow-[4px_4px_0_0_var(--color-rust)]"
                  : "border-ink/20 hover:border-ink/50 dark:border-ink-dark/20"
              }`}
            >
              <TemplatePreview template={template} />
              <div className="flex items-center justify-between px-1">
                <div>
                  <p className="font-serif text-base font-medium text-ink dark:text-ink-dark">
                    {template.name}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wide text-ink/50 dark:text-ink-dark/50">
                    {t.styleNames[template.style]}
                  </p>
                </div>
                {isActive && (
                  <span className="font-mono text-[10px] uppercase tracking-wide text-rust">
                    {t.active}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
