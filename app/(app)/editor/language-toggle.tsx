import type { ResumeLanguage } from "@/app/(app)/editor/types";

const OPTIONS: { value: ResumeLanguage; label: string }[] = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
];

type LanguageToggleProps = {
  language: ResumeLanguage;
  onChange: (language: ResumeLanguage) => void;
};

export function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-rust">
        Sprache des Lebenslaufs
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
      <p className="mt-2 text-xs text-ink/50 dark:text-ink-dark/50">
        Übersetzt automatisch generierte Beschriftungen (Abschnittsüberschriften, &bdquo;Geboren
        am&ldquo; usw.). Deine eigenen Texte übersetzt CVio nicht.
      </p>
    </div>
  );
}
