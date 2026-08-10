import type { Metadata } from "next";

import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";

export const metadata: Metadata = {
  title: "Impressum – CVio",
};

export default function ImpressumPage() {
  return (
    <div className="flex flex-1 flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-20">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
            Rechtliches
          </span>
          <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink dark:text-ink-dark">
            Impressum
          </h1>

          <div className="mt-10 flex flex-col gap-8 text-ink/80 dark:text-ink-dark/80">
            <div>
              <h2 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                Angaben gemäß § 5 DDG
              </h2>
              <p className="mt-2">
                Steve Leonel Yomi Mbiakop
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
                Verantwortlich für den Inhalt
              </h2>
              <p className="mt-2">Steve Leonel Yomi Mbiakop (Anschrift wie oben)</p>
            </div>

            <div>
              <h2 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                Hinweis zum Angebot
              </h2>
              <p className="mt-2">
                CVio ist ein privates, nicht-kommerzielles Projekt und wird ohne Gewinnerzielungsabsicht
                bereitgestellt. Es dient dem Erstellen und Exportieren eigener Lebensläufe im
                Freundes- und Bekanntenkreis des Betreibers.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                Haftung für Inhalte
              </h2>
              <p className="mt-2">
                Die Inhalte dieser Seite wurden mit Sorgfalt erstellt. Für die Richtigkeit,
                Vollständigkeit und Aktualität kann dennoch keine Gewähr übernommen werden. Als
                privater Betreiber bin ich für eigene Inhalte auf diesen Seiten nach den allgemeinen
                Gesetzen verantwortlich.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
