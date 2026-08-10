import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { de } from "@/app/lib/i18n/dictionaries/de";
import { en } from "@/app/lib/i18n/dictionaries/en";
import { fr } from "@/app/lib/i18n/dictionaries/fr";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/app/lib/i18n/locale";

export type { Dictionary } from "@/app/lib/i18n/dictionary-type";

const dictionaries = { de, en, fr };

// cache() memoizes per request: every Server Component on the tree can
// call getLocale()/getDictionary() directly without prop-drilling, and the
// cookie is only read once per request.
export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
});

export const getDictionary = cache(async () => {
  const locale = await getLocale();
  return dictionaries[locale];
});
