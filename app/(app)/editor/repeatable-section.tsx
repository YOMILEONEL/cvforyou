type RepeatableSectionProps<T extends { id: string }> = {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  addLabel: string;
  emptyLabel: string;
  renderTitle: (item: T, index: number) => string;
  renderFields: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
};

export function RepeatableSection<T extends { id: string }>({
  items,
  onChange,
  createItem,
  addLabel,
  emptyLabel,
  renderTitle,
  renderFields,
}: RepeatableSectionProps<T>) {
  function updateItem(id: string, patch: Partial<T>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      {items.length === 0 && (
        <p className="border border-dashed border-ink/25 p-6 text-center text-sm text-ink/50 dark:border-ink-dark/25 dark:text-ink-dark/50">
          {emptyLabel}
        </p>
      )}

      {items.map((item, index) => (
        <div key={item.id} className="border border-ink/20 p-4 dark:border-ink-dark/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wide text-ink/50 dark:text-ink-dark/50">
              {renderTitle(item, index)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-sm text-rust hover:underline"
            >
              Entfernen
            </button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {renderFields(item, (patch) => updateItem(item.id, patch))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, createItem()])}
        className="self-start border border-dashed border-ink/40 px-4 py-2 text-sm font-medium text-ink hover:border-ink dark:border-ink-dark/40 dark:text-ink-dark"
      >
        + {addLabel}
      </button>
    </div>
  );
}
