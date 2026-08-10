const footerLinks = [
  { href: "#", label: "Impressum" },
  { href: "#", label: "Datenschutz" },
  { href: "#", label: "Kontakt" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-dashed border-ink/25 dark:border-ink-dark/25">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="font-mono text-xs text-ink/60 dark:text-ink-dark/60">
          © {new Date().getFullYear()} CVio — für den privaten Gebrauch.
        </p>
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-ink/60 hover:text-ink dark:text-ink-dark/60 dark:hover:text-ink-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
