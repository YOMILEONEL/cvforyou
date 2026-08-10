"use client";

import { useTransition } from "react";

import { useDictionary } from "@/app/lib/i18n/dictionary-context";
import { setLocale } from "@/app/lib/i18n/locale-actions";
import { LOCALES, type Locale } from "@/app/lib/i18n/locale";

const LABELS: Record<Locale, string> = { de: "DE", en: "EN", fr: "FR" };

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale } = useDictionary();
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(() => {
      setLocale(next);
    });
  }

  return (
    <div className={`flex items-center gap-1 font-mono text-xs ${className}`} aria-label="Sprache / Language / Langue">
      {LOCALES.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleSelect(value)}
          disabled={isPending}
          aria-current={value === locale}
          className={`px-1.5 py-1 uppercase tracking-wide transition-colors disabled:cursor-wait ${
            value === locale
              ? "font-semibold text-ink dark:text-ink-dark"
              : "text-ink/40 hover:text-ink dark:text-ink-dark/40 dark:hover:text-ink-dark"
          }`}
        >
          {LABELS[value]}
        </button>
      ))}
    </div>
  );
}
