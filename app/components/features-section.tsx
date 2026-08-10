const highlight = {
  title: "ATS-optimierte Vorlagen",
  description:
    "Sauber strukturierte Layouts, die von Bewerbermanagementsystemen zuverlässig ausgelesen werden — kein verlorener Lebenslauf im Bewerber-Sieb.",
};

const features = [
  {
    title: "Live-Vorschau",
    description: "Jede Änderung an deinen Daten oder deinem Design siehst du sofort im fertigen Layout.",
  },
  {
    title: "Automatisches Speichern",
    description: "Deine Eingaben werden laufend gesichert — auch bei einem Verbindungsabbruch geht nichts verloren.",
  },
  {
    title: "Mehrsprachige Oberfläche",
    description: "Nutze CVio auf Deutsch oder Englisch — weitere Sprachen können folgen.",
  },
  {
    title: "Mehrere Lebensläufe",
    description: "Lege für jede Bewerbung eine eigene Version an, ohne Daten neu eingeben zu müssen.",
  },
  {
    title: "Datenschutz nach DSGVO",
    description: "Deine Daten gehören dir: Export und Löschung deines Profils sind jederzeit möglich.",
  },
];

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 0 1.415l-7.005 7.005a1 1 0 0 1-1.414 0L4.296 9.723a1 1 0 1 1 1.414-1.414l3.283 3.282 6.298-6.298a1 1 0 0 1 1.413-.003Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
          03 — Funktionen
        </span>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl dark:text-ink-dark">
          Alles, was du für deinen Lebenslauf brauchst
        </h2>
      </div>

      <div className="mt-14 flex flex-col gap-6">
        <div className="flex flex-col items-start gap-4 border border-ink bg-ink px-8 py-10 text-paper sm:flex-row sm:items-center sm:gap-8 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark">
          <div className="flex h-12 w-12 flex-none items-center justify-center border border-dashed border-rust text-rust">
            <CheckIcon />
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium">{highlight.title}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-paper/75 dark:text-paper-dark/75">
              {highlight.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-2 border border-ink/15 p-6 dark:border-ink-dark/15"
            >
              <div className="flex h-9 w-9 items-center justify-center border border-ink/30 text-ink dark:border-ink-dark/30 dark:text-ink-dark">
                <CheckIcon />
              </div>
              <h3 className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
                {feature.title}
              </h3>
              <p className="text-sm leading-6 text-ink/70 dark:text-ink-dark/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
