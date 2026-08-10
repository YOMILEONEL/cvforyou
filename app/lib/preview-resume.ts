import type { ResumeData, SectionMeta } from "@/app/(app)/editor/types";

// Generic placeholder content used only to render template preview
// thumbnails (see scripts/generate-template-previews.ts), not tied to any
// real person or organization.
export const previewResumeData: ResumeData = {
  language: "de",
  personal: {
    firstName: "Max",
    lastName: "Mustermann",
    title: "Marketing-Manager",
    email: "max.mustermann@email.de",
    phone: "+49 151 00000000",
    city: "Musterstadt",
    photoUrl: "",
    drivingLicense: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    birthPlace: "",
    birthDate: "",
  },
  experience: [
    {
      id: "1",
      company: "Musterfirma GmbH",
      position: "Marketing-Manager",
      location: "Musterstadt",
      from: "2022",
      to: "heute",
      description:
        "Planung und Umsetzung digitaler Marketingkampagnen.\nBetreuung von Social-Media-Kanälen und Content-Strategie.",
    },
  ],
  education: [
    {
      id: "1",
      institution: "Universität Musterstadt",
      degree: "B.A. Kommunikationswissenschaft",
      from: "2018",
      to: "2022",
      grade: "",
    },
  ],
  skills: [
    { id: "1", name: "Projektmanagement", level: 4 },
    { id: "2", name: "SEO", level: 3 },
  ],
  languages: [{ id: "1", name: "Deutsch", level: "C2" }],
  certificates: [],
  projects: [],
  references: [],
  freitext: {
    title: "Über mich",
    content: "Kreativer Kopf mit Leidenschaft für digitale Kommunikation.",
  },
};

export const previewSectionMeta: SectionMeta[] = [
  { id: "freitext", label: "Freitext", visible: true },
  { id: "education", label: "Ausbildung", visible: true },
  { id: "experience", label: "Berufserfahrung", visible: true },
  { id: "projects", label: "Projekte", visible: false },
  { id: "skills", label: "Fähigkeiten", visible: true },
  { id: "languages", label: "Sprachen", visible: true },
  { id: "certificates", label: "Zertifikate", visible: false },
  { id: "references", label: "Referenzen", visible: false },
];
