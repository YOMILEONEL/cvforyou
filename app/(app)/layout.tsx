import Link from "next/link";

import { LanguageSwitcher } from "@/app/components/language-switcher";
import { LogoMark } from "@/app/components/logo-mark";
import { LogoutButton } from "@/app/components/logout-button";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";
import { createClient } from "@/app/lib/supabase/server";

function getInitials(name: string): string {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return initials || "DU";
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const [{ data: { user } }, dict] = await Promise.all([supabase.auth.getUser(), getDictionary()]);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || "";

  return (
    <div className="flex flex-1 flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <header className="sticky top-0 z-50 border-b border-dashed border-ink/25 bg-paper/90 backdrop-blur-sm dark:border-ink-dark/25 dark:bg-paper-dark/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight text-ink dark:text-ink-dark"
          >
            <LogoMark className="h-6 w-6 text-rust" />
            CVforYou
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <Link
              href="/editor"
              className="hidden h-9 items-center border border-ink px-3 text-sm font-medium text-ink sm:flex dark:border-ink-dark/60 dark:text-ink-dark"
            >
              {dict.appHeader.newResume}
            </Link>
            <span
              title={displayName || undefined}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-forest font-mono text-xs text-forest"
            >
              {getInitials(displayName)}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
