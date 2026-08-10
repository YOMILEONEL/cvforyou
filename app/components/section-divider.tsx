export function SectionDivider() {
  return (
    <div className="mx-auto flex max-w-6xl items-center gap-4 px-6" aria-hidden="true">
      <div className="h-px flex-1 border-t border-dashed border-ink/25 dark:border-ink-dark/25" />
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 flex-none rotate-90 text-ink/40 dark:text-ink-dark/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <path d="M8 8l12 12M20 4L8 16" strokeLinecap="round" />
      </svg>
      <div className="h-px flex-1 border-t border-dashed border-ink/25 dark:border-ink-dark/25" />
    </div>
  );
}
