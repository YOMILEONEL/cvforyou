import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <header className="border-b border-dashed border-ink/25 dark:border-ink-dark/25">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <Link
            href="/"
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
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        {children}
      </main>
    </div>
  );
}
