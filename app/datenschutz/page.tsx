import type { Metadata } from "next";

import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Datenschutz – CVforYou",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">{title}</h2>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default async function DatenschutzPage() {
  const dict = await getDictionary();
  const t = dict.legal.datenschutz;
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
            <Section title={s.verantwortlicher.heading}>
              <p>
                {s.verantwortlicher.body}
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:leonelyomi3@gmail.com"
                  className="underline decoration-dashed decoration-ink/40 underline-offset-4 hover:decoration-ink dark:decoration-ink-dark/40"
                >
                  leonelyomi3@gmail.com
                </a>
              </p>
            </Section>

            <Section title={s.daten.heading}>
              <p>
                <strong>{s.daten.kontodatenLabel}</strong> {s.daten.kontodaten}
              </p>
              <p>
                <strong>{s.daten.lebenslaufLabel}</strong> {s.daten.lebenslauf}
              </p>
            </Section>

            <Section title={s.cookies.heading}>
              <p>{s.cookies.body}</p>
            </Section>

            <Section title={s.hosting.heading}>
              <p>{s.hosting.body}</p>
            </Section>

            <Section title={s.speicherdauer.heading}>
              <p>{s.speicherdauer.body}</p>
            </Section>

            <Section title={s.rechte.heading}>
              <p>{s.rechte.body}</p>
            </Section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
