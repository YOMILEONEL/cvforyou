import Link from "next/link";

import { getDictionary } from "@/app/lib/i18n/get-dictionary";

export async function HeroSection() {
  const dict = await getDictionary();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-16 md:grid-cols-2 md:items-center">
        <div className="flex flex-col items-start gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
            {dict.hero.badge}
          </span>

          <h1 className="font-serif text-4xl leading-[1.1] font-medium tracking-tight text-ink sm:text-5xl dark:text-ink-dark">
            {dict.hero.titlePrefix}{" "}
            <span className="relative whitespace-nowrap">
              {dict.hero.titleHighlight}
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                className="absolute -bottom-2 left-0 h-3 w-full text-rust"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q 50 2, 100 7 T 198 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            {dict.hero.titleSuffix}
          </h1>

          <p className="max-w-md text-lg leading-8 text-ink/70 dark:text-ink-dark/70">
            {dict.hero.subtitle}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/editor"
              className="flex h-12 items-center justify-center border border-ink bg-ink px-6 text-base font-semibold text-paper shadow-[4px_4px_0_0_var(--color-rust)] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <Link
              href="/vorlagen"
              className="flex h-12 items-center justify-center gap-2 px-2 text-base font-medium text-ink underline decoration-dashed decoration-ink/40 underline-offset-4 hover:decoration-ink dark:text-ink-dark dark:decoration-ink-dark/40 dark:hover:decoration-ink-dark"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm -rotate-2">
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 z-10 h-0 w-0 border-t-[26px] border-l-[26px] border-t-ink/15 border-l-transparent dark:border-t-ink-dark/15"
          />
          <div
            className="relative border border-ink bg-sheet p-6 shadow-[8px_8px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[8px_8px_0_0_var(--color-ink-dark)]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)",
            }}
          >
            <div className="flex items-center gap-4 border-b border-ink/15 pb-4 dark:border-ink-dark/15">
              <div className="h-14 w-14 flex-none rounded-full border border-dashed border-forest/60" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-3 w-28 rounded-full bg-ink/80 dark:bg-ink-dark/80" />
                <div className="h-2 w-20 rounded-full bg-ink/25 dark:bg-ink-dark/25" />
              </div>
            </div>

            {[
              { label: "w-full", accent: "bg-forest" },
              { label: "w-5/6", accent: "bg-rust" },
              { label: "w-2/3", accent: "bg-ochre" },
            ].map((row) => (
              <div key={row.label} className="mt-4 flex flex-col gap-2">
                <div className={`h-1.5 w-14 rounded-full ${row.accent}`} />
                <div
                  className={`h-2 ${row.label} rounded-full bg-ink/12 dark:bg-ink-dark/15`}
                />
                <div className="h-2 w-1/2 rounded-full bg-ink/12 dark:bg-ink-dark/15" />
              </div>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-8 flex h-20 w-20 rotate-[-9deg] items-center justify-center rounded-full border-2 border-dashed border-rust bg-paper text-center font-mono text-[9px] uppercase leading-tight tracking-wide text-rust dark:bg-paper-dark"
          >
            {dict.hero.badgeAts}
          </div>

          <div
            aria-hidden="true"
            className="absolute -top-5 -right-6 rotate-[6deg] border border-ink bg-ochre/90 px-3 py-1.5 font-mono text-[11px] font-medium text-ink shadow-[3px_3px_0_0_var(--color-ink)]"
          >
            {dict.hero.badgeTime}
          </div>
        </div>
      </div>
    </section>
  );
}
