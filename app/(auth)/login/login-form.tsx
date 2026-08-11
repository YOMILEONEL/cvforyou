"use client";

import { useActionState } from "react";

import { PasswordInput } from "@/app/components/password-input";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";
import { login, type AuthState } from "@/app/lib/auth-actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(login, undefined);
  const { dict } = useDictionary();
  const { login: t } = dict.auth;

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
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
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </label>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-ink/70 dark:text-ink-dark/70">
          <input type="checkbox" name="remember" className="h-4 w-4 border-ink/40" />
          {t.rememberMe}
        </label>
        <a
          href="#"
          title={t.forgotPasswordTitle}
          className="text-ink underline decoration-dashed decoration-ink/40 underline-offset-4 hover:decoration-ink dark:text-ink-dark dark:decoration-ink-dark/40"
        >
          {t.forgotPassword}
        </a>
      </div>

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
