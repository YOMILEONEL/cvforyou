import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/app/(auth)/register/register-form";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Registrieren – CVforYou",
};

export default async function RegisterPage() {
  const dict = await getDictionary();
  const { register: t, shared } = dict.auth;

  return (
    <div className="w-full max-w-sm border border-ink bg-sheet p-8 shadow-[6px_6px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[6px_6px_0_0_var(--color-ink-dark)]">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
        {t.eyebrow}
      </span>
      <h1 className="mt-2 font-serif text-3xl font-medium text-ink dark:text-ink-dark">
        {t.title}
      </h1>
      <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
        {t.subtitle}
      </p>

      <RegisterForm />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/15 dark:bg-ink-dark/15" />
        <span className="font-mono text-xs uppercase text-ink/40 dark:text-ink-dark/40">
          {shared.or}
        </span>
        <div className="h-px flex-1 bg-ink/15 dark:bg-ink-dark/15" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled
          title={shared.googleTitle}
          className="flex h-11 cursor-not-allowed items-center justify-center border border-ink/30 text-sm font-medium text-ink/50 dark:border-ink-dark/30 dark:text-ink-dark/50"
        >
          {shared.googleButton}
        </button>
        <button
          type="button"
          disabled
          title={shared.linkedinTitle}
          className="flex h-11 cursor-not-allowed items-center justify-center border border-ink/30 text-sm font-medium text-ink/50 dark:border-ink-dark/30 dark:text-ink-dark/50"
        >
          {shared.linkedinButton}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-ink/70 dark:text-ink-dark/70">
        {t.alreadyRegistered}{" "}
        <Link
          href="/login"
          className="font-medium text-ink underline decoration-dashed decoration-ink/40 underline-offset-4 hover:decoration-ink dark:text-ink-dark dark:decoration-ink-dark/40"
        >
          {t.loginLink}
        </Link>
      </p>
    </div>
  );
}
