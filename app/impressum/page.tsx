import type { Metadata } from "next";

import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Impressum – CVforYou",
};

export default async function ImpressumPage() {
  const dict = await getDictionary();
  const t = dict.legal.impressum;
  const s = t.sections;

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

          <div className="mt-10 flex flex-col gap-8 text-ink/80 dark:text-ink-dark/80">
            <div>
              <h2 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                {s.angaben.heading}
              </h2>
              <p className="mt-2">
                {s.angaben.body}
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:leonelyomi3@gmail.com"
                  className="underline decoration-dashed decoration-ink/40 underline-offset-4 hover:decoration-ink dark:decoration-ink-dark/40"
                >
                  leonelyomi3@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                {s.verantwortlich.heading}
              </h2>
              <p className="mt-2">{s.verantwortlich.body}</p>
            </div>

            <div>
              <h2 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                {s.hinweis.heading}
              </h2>
              <p className="mt-2">{s.hinweis.body}</p>
            </div>

            <div>
              <h2 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                {s.haftung.heading}
              </h2>
              <p className="mt-2">{s.haftung.body}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
