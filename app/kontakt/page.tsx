import type { Metadata } from "next";

import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Kontakt – CVio",
};

export default async function KontaktPage() {
  const dict = await getDictionary();
  const t = dict.legal.kontakt;

  return (
    <div className="flex flex-1 flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-20">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
            {t.eyebrow}
          </span>
          <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink dark:text-ink-dark">
            {t.title}
          </h1>
          <p className="mt-6 text-lg text-ink/70 dark:text-ink-dark/70">
            {t.subtitle}
          </p>

          <div className="mt-10 border border-ink bg-sheet p-8 shadow-[6px_6px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[6px_6px_0_0_var(--color-ink-dark)]">
            <p className="font-serif text-xl font-medium text-ink dark:text-ink-dark">
              Steve Leonel Yomi Mbiakop
            </p>
            <a
              href="mailto:leonelyomi3@gmail.com"
              className="mt-2 inline-block text-rust underline decoration-dashed decoration-rust/50 underline-offset-4 hover:decoration-rust"
            >
              leonelyomi3@gmail.com
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
