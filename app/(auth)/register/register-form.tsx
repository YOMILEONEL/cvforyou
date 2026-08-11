"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";

import { PasswordInput } from "@/app/components/password-input";
import { register, type AuthState } from "@/app/lib/auth-actions";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(register, undefined);
  const { dict } = useDictionary();
  const { register: t, errors } = dict.auth;
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [mismatch, setMismatch] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
      event.preventDefault();
      setMismatch(true);
      return;
    }
    setMismatch(false);
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
        {t.nameLabel}
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder={t.namePlaceholder}
          className="border border-ink/30 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-rust dark:border-ink-dark/30 dark:bg-paper-dark dark:text-ink-dark"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
        {t.emailLabel}
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={t.emailPlaceholder}
          className="border border-ink/30 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-rust dark:border-ink-dark/30 dark:bg-paper-dark dark:text-ink-dark"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
        {t.passwordLabel}
        <PasswordInput
          ref={passwordRef}
          name="password"
          required
          autoComplete="new-password"
          placeholder={t.passwordPlaceholder}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
        {t.confirmPasswordLabel}
        <PasswordInput
          ref={confirmPasswordRef}
          name="confirmPassword"
          required
          autoComplete="new-password"
          placeholder={t.confirmPasswordPlaceholder}
        />
      </label>

      {mismatch && <p className="text-sm text-rust">{errors.passwordMismatch}</p>}

      <label className="flex items-start gap-2 text-sm text-ink/70 dark:text-ink-dark/70">
        <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 border-ink/40" />
        {t.termsPrefix}{" "}
        <Link
          href="/datenschutz"
          className="underline decoration-dashed decoration-ink/40 underline-offset-4 hover:decoration-ink dark:decoration-ink-dark/40"
        >
          {t.termsLink}
        </Link>{" "}
        {t.termsSuffix}
      </label>

      {state?.error && <p className="text-sm text-rust">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex h-11 items-center justify-center border border-ink bg-ink text-sm font-semibold text-paper shadow-[3px_3px_0_0_var(--color-rust)] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
      >
        {pending ? t.submitPending : t.submit}
      </button>
    </form>
  );
}
