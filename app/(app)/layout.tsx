import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <header className="sticky top-0 z-50 border-b border-dashed border-ink/25 bg-paper/90 backdrop-blur-sm dark:border-ink-dark/25 dark:bg-paper-dark/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight text-ink dark:text-ink-dark"
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 rotate-[-8deg] items-center justify-center rounded-full border border-dashed border-rust text-[10px] font-mono text-rust"
            >
              ✓
            </span>
            CVio
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/editor"
              className="hidden h-9 items-center border border-ink px-3 text-sm font-medium text-ink sm:flex dark:border-ink-dark/60 dark:text-ink-dark"
            >
              Neuer Lebenslauf
            </Link>
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-forest font-mono text-xs text-forest"
            >
              DU
            </span>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
