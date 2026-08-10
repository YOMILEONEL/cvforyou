"use client";

import type { ResumeLanguage } from "@/app/(app)/editor/types";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";

// Each language's own name for itself — shown as-is regardless of platform
// UI language, same convention as any language picker (a "Deutsch" option
// doesn't become "German" just because the app is in English).
const OPTIONS: { value: ResumeLanguage; label: string }[] = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];

type LanguageToggleProps = {
  language: ResumeLanguage;
  onChange: (language: ResumeLanguage) => void;
};

export function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  const { dict } = useDictionary();
  const t = dict.editor.design;

  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-rust">
        {t.languageToggleLabel}
      </p>
      <div className="flex gap-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`border px-4 py-2 text-sm font-medium transition-colors ${
              language === option.value
                ? "border-ink bg-ink text-paper dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
                : "border-ink/30 text-ink/70 hover:border-ink dark:border-ink-dark/30 dark:text-ink-dark/70"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-ink/50 dark:text-ink-dark/50">{t.languageToggleHint}</p>
    </div>
  );
}
