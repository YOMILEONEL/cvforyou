"use client";

import { createContext, useContext } from "react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-type";
import type { Locale } from "@/app/lib/i18n/locale";

type DictionaryContextValue = { dict: Dictionary; locale: Locale };

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  dict,
  locale,
  children,
}: DictionaryContextValue & { children: React.ReactNode }) {
  return <DictionaryContext.Provider value={{ dict, locale }}>{children}</DictionaryContext.Provider>;
}

// Client Components can't call the server-only getDictionary() directly —
// this hook is how they reach the dictionary that a Server Component
// ancestor (the root layout) already fetched once per request.
export function useDictionary(): DictionaryContextValue {
  const ctx = useContext(DictionaryContext);
  if (!ctx) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return ctx;
}
