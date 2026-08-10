import type { ResumeData, SectionMeta } from "@/app/(app)/editor/types";
import { escapeHtml } from "@/app/lib/pdf/escape-html";
import { templates } from "@/app/lib/templates";

// Standalone HTML/CSS mirroring the four ResumePreview layouts. Deliberately
// not reusing the Tailwind-based React components: their utility classes
// only resolve through the app's compiled stylesheet, which a headless
// browser rendering a bare HTML string doesn't have access to.

function fullName(resume: ResumeData): string {
  return (
    [resume.personal.firstName, resume.personal.lastName].filter(Boolean).join(" ") ||
    "Dein Name"
  );
}

function contactLine(resume: ResumeData, separator = " · "): string {
  return [resume.personal.email, resume.personal.phone, resume.personal.city]
    .filter(Boolean)
    .join(separator);
}

function heading(label: string, dense: boolean): string {
  const cls = dense ? "section-heading-dense" : "section-heading";
  return `<h3 class="${cls}">${escapeHtml(label)}</h3>`;
}

function descriptionHtml(text: string, dense: boolean): string {
  if (!text) return "";
  if (dense) {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) return "";
    return `<ul class="bullets">${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`;
  }
  return `<p class="entry-desc">${escapeHtml(text)}</p>`;
}

function renderSection(section: SectionMeta, resume: ResumeData, dense: boolean): string {
  switch (section.id) {
    case "experience": {
      if (resume.experience.length === 0) return "";
      const items = resume.experience
        .map(
          (item) => `
        <div class="entry">
          <div class="entry-row">
            <p class="entry-title">${escapeHtml(item.position || "Position")}${item.company ? ` · ${escapeHtml(item.company)}` : ""}</p>
            <p class="entry-date">${escapeHtml([item.from, item.to].filter(Boolean).join(" – "))}</p>
          </div>
          ${item.location ? `<p class="entry-sub">${escapeHtml(item.location)}</p>` : ""}
          ${descriptionHtml(item.description, dense)}
        </div>`,
        )
        .join("");
      return `<section class="block">${heading(section.label, dense)}${items}</section>`;
    }
    case "education": {
      if (resume.education.length === 0) return "";
      const items = resume.education
        .map(
          (item) => `
        <div class="entry">
          <div class="entry-row">
            <p class="entry-title">${escapeHtml(item.degree || "Abschluss")}${item.institution ? ` · ${escapeHtml(item.institution)}` : ""}</p>
            <p class="entry-date">${escapeHtml([item.from, item.to].filter(Boolean).join(" – "))}</p>
          </div>
          ${item.grade ? `<p class="entry-sub">Note: ${escapeHtml(item.grade)}</p>` : ""}
        </div>`,
        )
        .join("");
      return `<section class="block">${heading(section.label, dense)}${items}</section>`;
    }
    case "skills": {
      if (resume.skills.length === 0) return "";
      const items = resume.skills
        .map(
          (item) =>
            `<span class="tag">${escapeHtml(item.name || "Fähigkeit")} ${"●".repeat(item.level)}${"○".repeat(5 - item.level)}</span>`,
        )
        .join("");
      return `<section class="block">${heading(section.label, dense)}<div class="tag-row">${items}</div></section>`;
    }
    case "languages": {
      if (resume.languages.length === 0) return "";
      const items = resume.languages
        .map((item) => `<span class="tag">${escapeHtml(item.name || "Sprache")} · ${item.level}</span>`)
        .join("");
      return `<section class="block">${heading(section.label, dense)}<div class="tag-row">${items}</div></section>`;
    }
    case "certificates": {
      if (resume.certificates.length === 0) return "";
      const items = resume.certificates
        .map(
          (item) => `
        <div class="entry-row">
          <p class="entry-small">${escapeHtml(item.title || "Zertifikat")}${item.issuer ? ` · ${escapeHtml(item.issuer)}` : ""}</p>
          <p class="entry-date">${escapeHtml(item.date)}</p>
        </div>`,
        )
        .join("");
      return `<section class="block">${heading(section.label, dense)}${items}</section>`;
    }
    case "projects": {
      if (resume.projects.length === 0) return "";
      const items = resume.projects
        .map(
          (item) => `
        <div class="entry">
          <p class="entry-title">${escapeHtml(item.title || "Projekt")}</p>
          ${descriptionHtml(item.description, dense)}
          ${item.link ? `<p class="entry-link">${escapeHtml(item.link)}</p>` : ""}
        </div>`,
        )
        .join("");
      return `<section class="block">${heading(section.label, dense)}${items}</section>`;
    }
    case "references": {
      if (resume.references.length === 0) return "";
      const items = resume.references
        .map(
          (item) =>
            `<p class="entry-small">${escapeHtml(item.name || "Name")}${item.role ? ` — ${escapeHtml(item.role)}` : ""}${item.contact ? ` · ${escapeHtml(item.contact)}` : ""}</p>`,
        )
        .join("");
      return `<section class="block">${heading(section.label, dense)}${items}</section>`;
    }
    case "freitext": {
      if (!resume.freitext.content) return "";
      return `<section class="block">${heading(resume.freitext.title || section.label, dense)}<p class="entry-desc">${escapeHtml(resume.freitext.content)}</p></section>`;
    }
    default:
      return "";
  }
}

function renderSectionsHtml(resume: ResumeData, sections: SectionMeta[], dense = false): string {
  return sections
    .filter((section) => section.visible)
    .map((section) => renderSection(section, resume, dense))
    .filter(Boolean)
    .join("\n");
}

function photoImg(photoUrl: string, sizePx: number, extraStyle = ""): string {
  if (!photoUrl) return "";
  return `<img src="${escapeHtml(photoUrl)}" alt="" style="width:${sizePx}px;height:${sizePx}px;border-radius:50%;object-fit:cover;flex:none;${extraStyle}" />`;
}

const BASE_CSS = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #211c15; background: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  h2, h3 { margin: 0; }
  .page { width: 210mm; min-height: 297mm; }
  .name { font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; margin: 0; }
  .title { color: #b9512e; font-size: 13px; margin: 4px 0 0; }
  .contact { font-size: 11px; letter-spacing: 0.02em; color: rgba(33,28,21,0.6); margin: 8px 0 0; }
  .section-heading { font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #b9512e; margin: 0 0 8px; font-weight: 600; }
  .section-heading-dense { font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em; color: #211c15; margin: 0 0 8px; font-weight: 700; padding-bottom: 4px; border-bottom: 1px solid rgba(33,28,21,0.25); }
  .block { margin-bottom: 20px; }
  .block:last-child { margin-bottom: 0; }
  .entry { margin-bottom: 10px; }
  .entry:last-child { margin-bottom: 0; }
  .entry-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 8px; }
  .entry-title { font-family: Georgia, 'Times New Roman', serif; font-size: 14px; font-weight: 600; margin: 0; }
  .entry-small { font-size: 12px; margin: 0 0 6px; }
  .entry-date { font-size: 10px; color: rgba(33,28,21,0.5); white-space: nowrap; margin: 0; }
  .entry-sub { font-size: 10px; color: rgba(33,28,21,0.5); margin: 0 0 4px; }
  .entry-desc { font-size: 12px; line-height: 1.6; color: rgba(33,28,21,0.8); margin: 4px 0 0; }
  .entry-link { font-size: 10px; color: #b9512e; margin: 4px 0 0; }
  .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { border: 1px solid rgba(33,28,21,0.2); padding: 3px 8px; font-size: 10px; border-radius: 2px; }
  .bullets { margin: 4px 0 0; padding-left: 16px; font-size: 12px; line-height: 1.6; color: rgba(33,28,21,0.85); }
  .bullets li { margin-bottom: 2px; }
`;

function minimalistischHtml(resume: ResumeData, sections: SectionMeta[]): string {
  const photo = photoImg(resume.personal.photoUrl, 56);
  return `
    <div class="page" style="padding: 18mm 16mm;">
      <header style="display: flex; align-items: center; gap: 16px; border-bottom: 1px solid rgba(33,28,21,0.15); padding-bottom: 14px; margin-bottom: 20px;">
        ${photo}
        <div>
          <h2 class="name">${escapeHtml(fullName(resume))}</h2>
          ${resume.personal.title ? `<p class="title">${escapeHtml(resume.personal.title)}</p>` : ""}
          <p class="contact">${escapeHtml(contactLine(resume)) || "E-Mail · Telefon · Ort"}</p>
        </div>
      </header>
      ${renderSectionsHtml(resume, sections)}
    </div>
  `;
}

function modernHtml(resume: ResumeData, sections: SectionMeta[]): string {
  const photo = photoImg(resume.personal.photoUrl, 56, "border: 2px dashed #2e5d4e;");
  const photoOrPlaceholder =
    photo || `<div style="width: 56px; height: 56px; border-radius: 50%; border: 2px dashed #2e5d4e;"></div>`;
  return `
    <div class="page" style="display: flex;">
      <aside style="width: 62mm; flex: none; background: rgba(46,93,78,0.08); padding: 18mm 10mm; border-right: 1px solid rgba(33,28,21,0.1);">
        ${photoOrPlaceholder}
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #2e5d4e; margin: 16px 0 6px;">Kontakt</p>
        <p style="font-size: 11px; margin: 0;">${escapeHtml(resume.personal.email) || "E-Mail"}</p>
        <p style="font-size: 11px; margin: 4px 0 0;">${escapeHtml(resume.personal.phone) || "Telefon"}</p>
        <p style="font-size: 11px; margin: 4px 0 0;">${escapeHtml(resume.personal.city) || "Ort"}</p>
      </aside>
      <div style="flex: 1; padding: 18mm 14mm;">
        <h2 class="name">${escapeHtml(fullName(resume))}</h2>
        ${resume.personal.title ? `<p class="title" style="color:#2e5d4e;">${escapeHtml(resume.personal.title)}</p>` : ""}
        <div style="margin-top: 20px;">
          ${renderSectionsHtml(resume, sections)}
        </div>
      </div>
    </div>
  `;
}

function kreativHtml(resume: ResumeData, sections: SectionMeta[]): string {
  const photo = photoImg(resume.personal.photoUrl, 56, "border: 2px solid rgba(255,253,247,0.6);");
  return `
    <div class="page">
      <header style="display: flex; align-items: center; gap: 16px; background: #b9512e; color: #fffdf7; padding: 16mm;">
        ${photo}
        <div>
          <h2 class="name" style="color: #fffdf7;">${escapeHtml(fullName(resume))}</h2>
          ${resume.personal.title ? `<p class="title" style="color: rgba(255,253,247,0.85);">${escapeHtml(resume.personal.title)}</p>` : ""}
          <p class="contact" style="color: rgba(255,253,247,0.75);">${escapeHtml(contactLine(resume)) || "E-Mail · Telefon · Ort"}</p>
        </div>
      </header>
      <div style="padding: 16mm;">
        ${renderSectionsHtml(resume, sections)}
      </div>
    </div>
  `;
}

function klassischHtml(resume: ResumeData, sections: SectionMeta[]): string {
  return `
    <div class="page" style="padding: 18mm 16mm;">
      <header style="text-align: center; border-bottom: 1px solid rgba(33,28,21,0.2); padding-bottom: 14px; margin-bottom: 20px;">
        <h2 class="name" style="font-weight: 700;">${escapeHtml(fullName(resume))}</h2>
        ${resume.personal.title ? `<p class="title" style="color: #c68a2e;">${escapeHtml(resume.personal.title)}</p>` : ""}
        <p class="contact" style="margin-top: 6px;">${escapeHtml(contactLine(resume, " | ")) || "Ort | Telefon | E-Mail"}</p>
      </header>
      ${renderSectionsHtml(resume, sections, true)}
    </div>
  `;
}

export function renderResumeHtml(
  resume: ResumeData,
  sections: SectionMeta[],
  templateName: string,
): string {
  const style = templates.find((t) => t.name === templateName)?.style ?? "Minimalistisch";

  const body =
    style === "Modern"
      ? modernHtml(resume, sections)
      : style === "Kreativ"
        ? kreativHtml(resume, sections)
        : style === "Klassisch"
          ? klassischHtml(resume, sections)
          : minimalistischHtml(resume, sections);

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(fullName(resume))}</title>
<style>${BASE_CSS}</style>
</head>
<body>${body}</body>
</html>`;
}
