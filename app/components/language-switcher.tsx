"use client";

import { useTransition } from "react";

import { useDictionary } from "@/app/lib/i18n/dictionary-context";
import { setLocale } from "@/app/lib/i18n/locale-actions";
import { LOCALES, type Locale } from "@/app/lib/i18n/locale";

const LABELS: Record<Locale, string> = { de: "DE", en: "EN", fr: "FR" };

// A native <select> instead of three separate buttons: it collapses to a
// single ~50px control (critical on narrow phone headers, where three
// always-visible buttons crowded out the rest of the header), and gets a
// working native picker on mobile for free.
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale } = useDictionary();
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as Locale;
    if (next === locale) return;
    startTransition(() => {
      setLocale(next);
    });
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      disabled={isPending}
      aria-label="Sprache / Language / Langue"
      className={`border border-ink/30 bg-transparent px-2 py-1 font-mono text-xs uppercase tracking-wide text-ink outline-none disabled:cursor-wait dark:border-ink-dark/30 dark:text-ink-dark ${className}`}
    >
      {LOCALES.map((value) => (
        <option key={value} value={value} className="bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
          {LABELS[value]}
        </option>
      ))}
    </select>
  );
}
