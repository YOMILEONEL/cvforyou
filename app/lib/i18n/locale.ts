// Platform UI language — independent from ResumeLanguage
// (app/(app)/editor/types.ts), which controls the language of the
// generated resume document itself, not the app chrome around it. A user
// can browse the app in English while writing a French resume.

export const LOCALES = ["de", "en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "de";
export const LOCALE_COOKIE = "cvio_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
