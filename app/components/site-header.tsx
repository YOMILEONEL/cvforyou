import Link from "next/link";

import { LanguageSwitcher } from "@/app/components/language-switcher";
import { LogoMark } from "@/app/components/logo-mark";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";

export async function SiteHeader() {
  const dict = await getDictionary();
  const navLinks = [
    { href: "/vorlagen", label: dict.header.navVorlagen },
    { href: "/#so-funktionierts", label: dict.header.navHowItWorks },
    { href: "/#features", label: dict.header.navFeatures },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-dashed border-ink/25 bg-paper/90 backdrop-blur-sm dark:border-ink-dark/25 dark:bg-paper-dark/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight text-ink dark:text-ink-dark"
        >
          <LogoMark className="h-6 w-6 text-rust" />
          CVforYou
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-ink/70 dark:text-ink-dark/70"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-rust transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="hidden text-sm font-medium text-ink/70 hover:text-ink sm:block dark:text-ink-dark/70 dark:hover:text-ink-dark"
          >
            {dict.header.login}
          </Link>
          <Link
            href="/editor"
            className="border border-ink bg-ink px-3 py-2 text-sm font-semibold text-paper shadow-[3px_3px_0_0_var(--color-rust)] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 sm:px-4 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
          >
            {dict.header.createResume}
          </Link>
        </div>
      </div>
    </header>
  );
}
