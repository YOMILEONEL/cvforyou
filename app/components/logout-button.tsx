"use client";

import { useState, useTransition } from "react";

import { logout } from "@/app/lib/auth-actions";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";

export function LogoutButton() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { dict } = useDictionary();
  const t = dict.appHeader;

  function handleConfirm() {
    startTransition(() => {
      // logout() redirects server-side (Next.js throws a special redirect
      // signal internally); nothing else to do with its result here.
      logout();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="text-sm font-medium text-ink/60 hover:text-ink dark:text-ink-dark/60 dark:hover:text-ink-dark"
      >
        {t.logout}
      </button>

      {confirmOpen && (
        <div
          role="presentation"
          onClick={() => !isPending && setConfirmOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6 dark:bg-black/60"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label={t.logoutConfirmMessage}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm border border-ink bg-sheet p-6 shadow-[6px_6px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[6px_6px_0_0_var(--color-ink-dark)]"
          >
            <p className="font-serif text-lg font-medium text-ink dark:text-ink-dark">
              {t.logoutConfirmMessage}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={isPending}
                className="border border-ink/30 px-4 py-2 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-dark/30 dark:text-ink-dark"
              >
                {t.logoutCancel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="border border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper shadow-[3px_3px_0_0_var(--color-rust)] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
              >
                {t.logoutConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
