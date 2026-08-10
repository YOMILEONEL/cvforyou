import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative flex flex-col items-center gap-6 border border-ink bg-ink px-6 py-16 text-center shadow-[8px_8px_0_0_var(--color-rust)] dark:border-ink-dark dark:bg-ink-dark">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
          04 — Loslegen
        </span>
        <h2 className="max-w-xl font-serif text-3xl font-medium tracking-tight text-paper sm:text-4xl dark:text-paper-dark">
          Bereit für deinen neuen Lebenslauf?
        </h2>
        <p className="max-w-md text-paper/70 dark:text-paper-dark/70">
          Kostenlos starten, Vorlage wählen und in wenigen Minuten dein
          fertiges PDF herunterladen.
        </p>
        <Link
          href="/editor"
          className="flex h-12 items-center justify-center border border-paper bg-paper px-6 text-base font-semibold text-ink shadow-[3px_3px_0_0_var(--color-rust)] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 dark:border-paper-dark dark:bg-paper-dark dark:text-ink-dark"
        >
          Jetzt Lebenslauf erstellen
        </Link>
      </div>
    </section>
  );
}
