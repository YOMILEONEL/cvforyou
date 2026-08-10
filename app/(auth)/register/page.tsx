import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registrieren – CVio",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm border border-ink bg-sheet p-8 shadow-[6px_6px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[6px_6px_0_0_var(--color-ink-dark)]">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
        Kostenlos starten
      </span>
      <h1 className="mt-2 font-serif text-3xl font-medium text-ink dark:text-ink-dark">
        Konto erstellen
      </h1>
      <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
        Speichere deine Lebensläufe und bearbeite sie jederzeit weiter.
      </p>

      <form className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
          Name
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Vor- und Nachname"
            className="border border-ink/30 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-rust dark:border-ink-dark/30 dark:bg-paper-dark dark:text-ink-dark"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
          E-Mail
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="du@beispiel.de"
            className="border border-ink/30 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-rust dark:border-ink-dark/30 dark:bg-paper-dark dark:text-ink-dark"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
          Passwort
          <input
            type="password"
            name="password"
            required
            autoComplete="new-password"
            placeholder="Mind. 8 Zeichen"
            className="border border-ink/30 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-rust dark:border-ink-dark/30 dark:bg-paper-dark dark:text-ink-dark"
          />
        </label>

        <label className="flex items-start gap-2 text-sm text-ink/70 dark:text-ink-dark/70">
          <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 border-ink/40" />
          Ich stimme den Nutzungsbedingungen und der Datenschutzerklärung zu.
        </label>

        <button
          type="submit"
          className="mt-2 flex h-11 items-center justify-center border border-ink bg-ink text-sm font-semibold text-paper shadow-[3px_3px_0_0_var(--color-rust)] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
        >
          Konto erstellen
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/15 dark:bg-ink-dark/15" />
        <span className="font-mono text-xs uppercase text-ink/40 dark:text-ink-dark/40">
          oder
        </span>
        <div className="h-px flex-1 bg-ink/15 dark:bg-ink-dark/15" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex h-11 items-center justify-center border border-ink/30 text-sm font-medium text-ink dark:border-ink-dark/30 dark:text-ink-dark"
        >
          Mit Google fortfahren
        </button>
        <button
          type="button"
          className="flex h-11 items-center justify-center border border-ink/30 text-sm font-medium text-ink dark:border-ink-dark/30 dark:text-ink-dark"
        >
          Mit LinkedIn fortfahren
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-ink/70 dark:text-ink-dark/70">
        Schon registriert?{" "}
        <Link
          href="/login"
          className="font-medium text-ink underline decoration-dashed decoration-ink/40 underline-offset-4 hover:decoration-ink dark:text-ink-dark dark:decoration-ink-dark/40"
        >
          Jetzt anmelden
        </Link>
      </p>
    </div>
  );
}
