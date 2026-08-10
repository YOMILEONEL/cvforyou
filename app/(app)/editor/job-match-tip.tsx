"use client";

import { useEffect, useState } from "react";

import { RobotIcon } from "@/app/components/robot-icon";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";

const STORAGE_KEY = "cvio-job-match-tip-dismissed";

type JobMatchTipProps = {
  onOpenJobMatch: () => void;
};

// One-time onboarding tip: appears bottom-right the first time someone
// opens the editor, points at the "Stellenabgleich" nav item, and stays
// dismissed (localStorage) once closed — never nags again after that.
export function JobMatchTip({ onOpenJobMatch }: JobMatchTipProps) {
  const [visible, setVisible] = useState(false);
  const { dict } = useDictionary();
  const t = dict.editor.jobMatchTip;

  useEffect(() => {
    // Deliberately effect+setState, not a lazy useState initializer:
    // localStorage doesn't exist during SSR, so an initializer would
    // return a different value on the server than on the client and
    // trigger a hydration mismatch. Starting at `false` and flipping
    // post-mount keeps server and first client render identical.
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      // Storage unavailable (private browsing, blocked cookies) — show the
      // tip anyway rather than silently failing closed.
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Nothing to fall back to — the tip will just reappear next visit.
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-xs gap-3 border border-ink bg-sheet p-4 shadow-[6px_6px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[6px_6px_0_0_var(--color-ink-dark)]">
      <RobotIcon className="h-9 w-9 flex-none text-rust" />
      <div className="flex flex-col gap-3">
        <p className="text-sm leading-6 text-ink/80 dark:text-ink-dark/80">
          {t.message}{" "}
          <button
            type="button"
            onClick={() => {
              onOpenJobMatch();
              dismiss();
            }}
            className="font-medium text-rust underline decoration-dashed decoration-rust/50 underline-offset-4 hover:decoration-rust"
          >
            {dict.editor.nav.jobMatch}
          </button>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="self-end border border-ink bg-ink px-3 py-1 text-xs font-semibold text-paper transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
        >
          {t.dismiss}
        </button>
      </div>
    </div>
  );
}
