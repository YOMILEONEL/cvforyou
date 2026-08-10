"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { LOCALE_COOKIE, type Locale } from "@/app/lib/i18n/locale";

export async function setLocale(locale: Locale): Promise<void> {
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  // Every Server Component reads the locale via the same request-memoized
  // getDictionary(); revalidating the whole tree is what makes the switch
  // apply everywhere in one action, no per-page refresh logic needed.
  revalidatePath("/", "layout");
}
