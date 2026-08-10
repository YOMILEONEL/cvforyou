import type { de } from "@/app/lib/i18n/dictionaries/de";

// Separate from get-dictionary.ts (which is "server-only") so en.ts/fr.ts
// can import the type without pulling a server-only module into a file
// that dictionaries themselves don't need to be server-restricted.
export type Dictionary = typeof de;
