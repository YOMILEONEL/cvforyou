import Link from "next/link";

import { getDictionary } from "@/app/lib/i18n/get-dictionary";

export async function SiteFooter() {
  const dict = await getDictionary();
  const footerLinks = [
    { href: "/impressum", label: dict.footer.impressum },
    { href: "/datenschutz", label: dict.footer.datenschutz },
    { href: "/kontakt", label: dict.footer.kontakt },
  ];

  return (
    <footer className="border-t border-dashed border-ink/25 dark:border-ink-dark/25">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="font-mono text-xs text-ink/60 dark:text-ink-dark/60">
          © {new Date().getFullYear()} CVio — {dict.footer.copyright}
        </p>
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-ink/60 hover:text-ink dark:text-ink-dark/60 dark:hover:text-ink-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
