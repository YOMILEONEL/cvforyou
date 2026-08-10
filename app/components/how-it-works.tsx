const steps = [
  {
    number: "01",
    title: "Vorlage wählen",
    description: "Entscheide dich für eine von mehreren Designs — minimalistisch, modern oder kreativ.",
    rotate: "-rotate-3",
  },
  {
    number: "02",
    title: "Daten eingeben",
    description: "Fülle Berufserfahrung, Ausbildung, Skills und mehr in einem geführten Formular aus.",
    rotate: "rotate-2",
  },
  {
    number: "03",
    title: "Design anpassen",
    description: "Passe Farben, Schriftart und Layout an und sieh die Änderungen live in der Vorschau.",
    rotate: "-rotate-2",
  },
  {
    number: "04",
    title: "PDF herunterladen",
    description: "Exportiere deinen fertigen Lebenslauf druckreif als PDF und bewirb dich direkt.",
    rotate: "rotate-3",
  },
];

export function HowItWorks() {
  return (
    <section id="so-funktionierts" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
          02 — So funktioniert&apos;s
        </span>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl dark:text-ink-dark">
          In 4 Schritten zum fertigen Lebenslauf
        </h2>
      </div>

      <ol className="relative mt-20 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
        <div
          aria-hidden="true"
          className="absolute top-6 left-0 hidden h-px w-full border-t border-dashed border-ink/25 lg:block dark:border-ink-dark/25"
        />
        {steps.map((step) => (
          <li key={step.number} className="relative flex flex-col gap-3">
            <span
              className={`relative z-10 flex h-12 w-12 ${step.rotate} items-center justify-center rounded-full border-2 border-dashed border-rust bg-paper font-mono text-sm font-semibold text-rust dark:bg-paper-dark`}
            >
              {step.number}
            </span>
            <h3 className="font-serif text-xl font-medium text-ink dark:text-ink-dark">
              {step.title}
            </h3>
            <p className="text-sm leading-6 text-ink/70 dark:text-ink-dark/70">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
