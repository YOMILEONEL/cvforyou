export type PersonalInfo = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  photoUrl: string;
  drivingLicense: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  birthPlace: string;
  birthDate: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  location: string;
  from: string;
  to: string;
  description: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  from: string;
  to: string;
  grade: string;
};

export type Skill = {
  id: string;
  name: string;
  level: number; // 1-5
};

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export type Language = {
  id: string;
  name: string;
  level: CefrLevel;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  link: string;
};

export type Reference = {
  id: string;
  name: string;
  role: string;
  contact: string;
};

export type FreitextSection = {
  title: string;
  content: string;
};

export type ListSectionId =
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "certificates"
  | "projects"
  | "references";

export type SectionId = ListSectionId | "freitext";

export type EditorSection = SectionId | "personal" | "design";

// Language the generated resume (preview + PDF) is displayed in — this
// translates the app's own generated labels ("Berufserfahrung" -> "Work
// Experience", "Geboren am" -> "Born on", etc.), not the user's own typed
// content.
export type ResumeLanguage = "de" | "en";

export type ResumeData = {
  personal: PersonalInfo;
  language: ResumeLanguage;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certificates: Certificate[];
  projects: Project[];
  references: Reference[];
  freitext: FreitextSection;
};

export type SectionMeta = {
  id: SectionId;
  label: string;
  visible: boolean;
};

export const SECTION_LABELS: Record<SectionId, string> = {
  freitext: "Freitext",
  education: "Ausbildung",
  experience: "Berufserfahrung",
  projects: "Projekte",
  skills: "Fähigkeiten",
  languages: "Sprachen",
  certificates: "Zertifikate",
  references: "Referenzen",
};

export const initialResumeData: ResumeData = {
  language: "de",
  personal: {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    city: "",
    photoUrl: "",
    drivingLicense: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    birthPlace: "",
    birthDate: "",
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
  projects: [],
  references: [],
  freitext: { title: "Über mich", content: "" },
};

export const initialSectionMeta: SectionMeta[] = (
  Object.keys(SECTION_LABELS) as SectionId[]
).map((id) => ({ id, label: SECTION_LABELS[id], visible: true }));

let idCounter = 0;

export function createId(): string {
  idCounter += 1;
  return `item-${idCounter}-${Date.now().toString(36)}`;
}
