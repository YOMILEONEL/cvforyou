"use client";

import { useState } from "react";

import { RobotIcon } from "@/app/components/robot-icon";
import { useDictionary } from "@/app/lib/i18n/dictionary-context";

type JobMatchTipProps = {
  onOpenJobMatch: () => void;
};

// Onboarding tip pointing at "Stellenabgleich", shows every time the
// editor is opened (by design, not persisted). Dismissing it only hides it
// for the current page view; it's back next time this component mounts.
export function JobMatchTip({ onOpenJobMatch }: JobMatchTipProps) {
  const [visible, setVisible] = useState(true);
  const { dict } = useDictionary();
  const t = dict.editor.jobMatchTip;

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
              setVisible(false);
            }}
            className="font-medium text-rust underline decoration-dashed decoration-rust/50 underline-offset-4 hover:decoration-rust"
          >
            {dict.editor.nav.jobMatch}
          </button>
          .
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="self-end border border-ink bg-ink px-3 py-1 text-xs font-semibold text-paper transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
        >
          {t.dismiss}
        </button>
      </div>
    </div>
  );
}
