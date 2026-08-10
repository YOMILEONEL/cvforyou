import { styleAccent, type Template } from "@/app/lib/templates";

export function TemplatePreview({ template }: { template: Template }) {
  const accent = styleAccent[template.style];

  if (template.style === "Modern") {
    return (
      <div className="flex h-40 gap-2 bg-paper p-3 dark:bg-paper-dark">
        <div className={`w-1/3 ${accent} opacity-90`} />
        <div className="flex flex-1 flex-col gap-1.5 pt-1">
          <div className="h-2 w-4/5 rounded-full bg-ink/20 dark:bg-ink-dark/20" />
          <div className="h-1.5 w-3/5 rounded-full bg-ink/12 dark:bg-ink-dark/12" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-ink/12 dark:bg-ink-dark/12" />
          <div className="h-1.5 w-5/6 rounded-full bg-ink/12 dark:bg-ink-dark/12" />
          <div className="h-1.5 w-2/3 rounded-full bg-ink/12 dark:bg-ink-dark/12" />
        </div>
      </div>
    );
  }

  if (template.style === "Kreativ") {
    return (
      <div className="h-40 overflow-hidden bg-paper dark:bg-paper-dark">
        <div className={`h-12 w-full ${accent} opacity-90`} />
        <div className="flex flex-col gap-1.5 p-3">
          <div className="h-2 w-3/5 rounded-full bg-ink/20 dark:bg-ink-dark/20" />
          <div className="mt-1 h-1.5 w-full rounded-full bg-ink/12 dark:bg-ink-dark/12" />
          <div className="h-1.5 w-5/6 rounded-full bg-ink/12 dark:bg-ink-dark/12" />
          <div className="h-1.5 w-4/6 rounded-full bg-ink/12 dark:bg-ink-dark/12" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-40 flex-col items-center gap-1.5 bg-paper p-4 dark:bg-paper-dark">
      <div className={`h-2 w-2/5 rounded-full ${accent}`} />
      <div className="mb-2 h-1.5 w-1/4 rounded-full bg-ink/20 dark:bg-ink-dark/20" />
      <div className="h-1.5 w-full rounded-full bg-ink/12 dark:bg-ink-dark/12" />
      <div className="h-1.5 w-full rounded-full bg-ink/12 dark:bg-ink-dark/12" />
      <div className="h-1.5 w-3/4 rounded-full bg-ink/12 dark:bg-ink-dark/12" />
    </div>
  );
}
