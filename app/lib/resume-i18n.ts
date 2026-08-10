import type { ResumeLanguage, SectionId } from "@/app/(app)/editor/types";

// Labels the app generates itself for the resume preview/PDF. Deliberately
// does not touch the user's own typed content (job descriptions, freitext
// body, etc.) — only the structural connector text around it.

export const RESUME_SECTION_LABELS: Record<ResumeLanguage, Record<SectionId, string>> = {
  de: {
    freitext: "Freitext",
    education: "Ausbildung",
    experience: "Berufserfahrung",
    projects: "Projekte",
    skills: "Fähigkeiten",
    languages: "Sprachen",
    certificates: "Zertifikate",
    references: "Referenzen",
  },
  en: {
    freitext: "About",
    education: "Education",
    experience: "Work Experience",
    projects: "Projects",
    skills: "Skills",
    languages: "Languages",
    certificates: "Certificates",
    references: "References",
  },
  fr: {
    freitext: "À propos",
    education: "Formation",
    experience: "Expérience professionnelle",
    projects: "Projets",
    skills: "Compétences",
    languages: "Langues",
    certificates: "Certifications",
    references: "Références",
  },
};

export function getSectionLabel(id: SectionId, language: ResumeLanguage): string {
  return RESUME_SECTION_LABELS[language][id];
}

type ResumeUiStrings = {
  grade: string;
  drivingLicense: string;
  bornOn: string;
  bornIn: string;
  /** Preposition joining a date and a place, e.g. "Geboren am 1.1.2000 {in} Berlin". */
  inConnector: string;
  contactHeading: string;
  contactPlaceholder: string;
  klassischContactPlaceholder: string;
  freitextDefaultTitle: string;
};

export const RESUME_UI_STRINGS: Record<ResumeLanguage, ResumeUiStrings> = {
  de: {
    grade: "Note",
    drivingLicense: "Führerschein",
    bornOn: "Geboren am",
    bornIn: "Geboren in",
    inConnector: "in",
    contactHeading: "Kontakt",
    contactPlaceholder: "E-Mail · Telefon · Ort",
    klassischContactPlaceholder: "Ort | Telefon | E-Mail",
    freitextDefaultTitle: "Über mich",
  },
  en: {
    grade: "Grade",
    drivingLicense: "Driving license",
    bornOn: "Born on",
    bornIn: "Born in",
    inConnector: "in",
    contactHeading: "Contact",
    contactPlaceholder: "Email · Phone · City",
    klassischContactPlaceholder: "City | Phone | Email",
    freitextDefaultTitle: "About Me",
  },
  fr: {
    grade: "Note",
    drivingLicense: "Permis de conduire",
    bornOn: "Né(e) le",
    bornIn: "Né(e) à",
    inConnector: "à",
    contactHeading: "Contact",
    contactPlaceholder: "E-mail · Téléphone · Ville",
    klassischContactPlaceholder: "Ville | Téléphone | E-mail",
    freitextDefaultTitle: "À propos de moi",
  },
};
