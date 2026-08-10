export type TemplateStyle = "Minimalistisch" | "Modern" | "Kreativ";

export type Template = {
  name: string;
  style: TemplateStyle;
  badge?: "Beliebt" | "Neu";
};

export const styleAccent: Record<TemplateStyle, string> = {
  Minimalistisch: "bg-ink dark:bg-ink-dark",
  Modern: "bg-forest",
  Kreativ: "bg-rust",
};

export const templates: Template[] = [
  { name: "Berlin", style: "Minimalistisch", badge: "Beliebt" },
  { name: "Lissabon", style: "Modern" },
  { name: "Kyoto", style: "Kreativ", badge: "Neu" },
  { name: "Oslo", style: "Minimalistisch" },
  { name: "Toronto", style: "Modern" },
  { name: "Nairobi", style: "Kreativ" },
  { name: "Genf", style: "Minimalistisch" },
  { name: "Seoul", style: "Modern", badge: "Neu" },
  { name: "Valencia", style: "Kreativ" },
  { name: "Helsinki", style: "Minimalistisch" },
  { name: "Marrakesch", style: "Kreativ" },
  { name: "Singapur", style: "Modern" },
];
