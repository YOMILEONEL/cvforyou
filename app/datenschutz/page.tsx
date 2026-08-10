import type { Metadata } from "next";

import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";

export const metadata: Metadata = {
  title: "Datenschutz – CVio",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">{title}</h2>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default function DatenschutzPage() {
  return (
    <div className="flex flex-1 flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-20">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
            Rechtliches
          </span>
          <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink dark:text-ink-dark">
            Datenschutzerklärung
          </h1>

          <div className="mt-10 flex flex-col gap-8 text-ink/80 dark:text-ink-dark/80">
            <Section title="Verantwortlicher">
              <p>
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
            </Section>

            <Section title="Welche Daten werden verarbeitet?">
              <p>
                <strong>Kontodaten:</strong> Bei der Registrierung werden deine E-Mail-Adresse, dein
                Passwort (verschlüsselt gespeichert) und optional dein Name verarbeitet.
              </p>
              <p>
                <strong>Lebenslauf-Inhalte:</strong> Alle Angaben, die du im Editor einträgst (z. B.
                Name, Kontaktdaten, Berufserfahrung, Ausbildung, Foto), werden gespeichert, damit du
                deinen Lebenslauf jederzeit weiterbearbeiten und als PDF exportieren kannst. Diese
                Daten gibst du selbst ein und kannst sie jederzeit ändern oder löschen.
              </p>
            </Section>

            <Section title="Cookies">
              <p>
                CVio verwendet ausschließlich technisch notwendige Cookies zur Aufrechterhaltung
                deiner Anmeldesitzung (Session-Cookies von Supabase Auth). Es werden keine
                Marketing-, Analyse- oder Tracking-Cookies eingesetzt.
              </p>
            </Section>

            <Section title="Hosting und eingesetzte Dienstleister">
              <p>
                CVio wird über <strong>Vercel</strong> gehostet. Datenbank, Authentifizierung und der
                Speicher für hochgeladene Fotos laufen über <strong>Supabase</strong>. Beide Anbieter
                können Daten auch außerhalb der EU verarbeiten; in diesem Fall stellen die Anbieter
                geeignete Garantien (z. B. EU-Standardvertragsklauseln) bereit.
              </p>
            </Section>

            <Section title="Speicherdauer">
              <p>
                Deine Daten werden gespeichert, solange dein Konto besteht. Du kannst einzelne
                Lebensläufe jederzeit im Dashboard löschen. Für die Löschung deines gesamten Kontos
                genügt eine kurze E-Mail an die oben genannte Adresse.
              </p>
            </Section>

            <Section title="Deine Rechte">
              <p>
                Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
                Verarbeitung deiner Daten sowie auf Datenübertragbarkeit und Widerspruch (Art. 15–21
                DSGVO). Wende dich dazu einfach an die oben genannte E-Mail-Adresse. Außerdem steht
                dir ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde zu.
              </p>
            </Section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
