import type { Metadata } from "next";

import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { TemplateGallery } from "@/app/vorlagen/template-gallery";

export const metadata: Metadata = {
  title: "Vorlagen – CVio",
  description: "Alle CVio-Lebenslaufvorlagen: minimalistisch, modern oder kreativ — ATS-optimiert und frei anpassbar.",
};

export default function VorlagenPage() {
  return (
    <div className="flex flex-1 flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
              Vorlagen
            </span>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl dark:text-ink-dark">
              Wähle deinen Stil
            </h1>
            <p className="mt-4 text-lg text-ink/70 dark:text-ink-dark/70">
              Jede Vorlage ist ATS-optimiert und lässt sich im Editor in
              Farbe, Schriftart und Layout anpassen.
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
