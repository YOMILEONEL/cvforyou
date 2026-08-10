import type { Metadata } from "next";

import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";
import { TemplateGallery } from "@/app/vorlagen/template-gallery";

export const metadata: Metadata = {
  title: "Vorlagen – CVforYou",
  description: "Alle CVforYou-Lebenslaufvorlagen: minimalistisch, modern oder kreativ — ATS-optimiert und frei anpassbar.",
};

export default async function VorlagenPage() {
  const dict = await getDictionary();
  const t = dict.vorlagenPage;

  return (
    <div className="flex flex-1 flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
              {t.eyebrow}
            </span>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl dark:text-ink-dark">
              {t.title}
            </h1>
            <p className="mt-4 text-lg text-ink/70 dark:text-ink-dark/70">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-14">
            <TemplateGallery />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
