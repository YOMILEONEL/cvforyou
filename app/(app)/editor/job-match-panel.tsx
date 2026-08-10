"use client";

import { useState, useTransition } from "react";

import type { ResumeData } from "@/app/(app)/editor/types";
import { matchResumeToJob, type MatchErrorCode, type MatchResumeState } from "@/app/lib/match-actions";

type JobMatchPanelProps = {
  resume: ResumeData;
};

// Two different "no capacity right now" cases, each with a short label so
// the two are never confused: your own daily check vs. the app's shared
// Google-quota for the day. Everything else (bad input, technical failure)
// renders as a plain error line below.
const QUOTA_LABELS: Partial<Record<MatchErrorCode, string>> = {
  daily_limit_reached: "Dein Tageslimit",
  app_quota_exceeded: "App-weites Kontingent",
};

function ResultList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-wide text-ink/50 dark:text-ink-dark/50">{title}</h3>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink/80 dark:text-ink-dark/80">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span aria-hidden="true" className="text-rust">
              →
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobMatchPanel({ resume }: JobMatchPanelProps) {
  const [jobPosting, setJobPosting] = useState("");
  const [state, setState] = useState<MatchResumeState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  function handleCheck() {
    startTransition(async () => {
      const result = await matchResumeToJob(resume, jobPosting);
      setState(result);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink/70 dark:text-ink-dark/70">
        Füge den Text einer Stellenausschreibung ein, um zu sehen, wie gut dein Lebenslauf dazu passt. Diese
        Prüfung steht dir einmal pro Tag zur Verfügung.
      </p>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink dark:text-ink-dark">
        Stellenausschreibung
        <textarea
          rows={10}
          value={jobPosting}
          onChange={(event) => setJobPosting(event.target.value)}
          placeholder="Text der Stellenausschreibung hier einfügen …"
          className="border border-ink/30 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-rust dark:border-ink-dark/30 dark:bg-paper-dark dark:text-ink-dark"
        />
      </label>

      <button
        type="button"
        onClick={handleCheck}
        disabled={isPending || !jobPosting.trim()}
        className="self-start border border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper shadow-[3px_3px_0_0_var(--color-rust)] transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-dark dark:bg-ink-dark dark:text-paper-dark"
      >
        {isPending ? "Wird geprüft …" : "Abgleich starten"}
      </button>

      {state.status === "error" &&
        (QUOTA_LABELS[state.code] ? (
          <div className="flex flex-col gap-1 border border-dashed border-rust/50 bg-rust/5 px-4 py-3 text-sm text-ink/80 dark:border-rust/40 dark:text-ink-dark/80">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              {QUOTA_LABELS[state.code]}
            </span>
            <span>{state.error}</span>
          </div>
        ) : (
          <p className="text-sm text-rust">{state.error}</p>
        ))}

      {state.status === "success" && (
        <div className="mt-2 flex flex-col gap-6 border border-ink bg-sheet p-6 shadow-[6px_6px_0_0_var(--color-ink)] dark:border-ink-dark/60 dark:bg-sheet-dark dark:shadow-[6px_6px_0_0_var(--color-ink-dark)]">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-4xl font-medium text-ink dark:text-ink-dark">
              {state.result.score}%
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">Match-Score</span>
          </div>

          <ResultList title="Passende Fähigkeiten" items={state.result.matchedSkills} />
          <ResultList title="Fehlende Fähigkeiten" items={state.result.missingSkills} />
          <ResultList title="Verbesserungsvorschläge" items={state.result.suggestions} />
          <ResultList title="Deine Stärken für diese Stelle" items={state.result.strengths} />
        </div>
      )}
    </div>
  );
}
