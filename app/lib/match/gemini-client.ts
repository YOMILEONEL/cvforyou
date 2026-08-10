import "server-only";

import { GoogleGenerativeAI, GoogleGenerativeAIFetchError, SchemaType, type ResponseSchema } from "@google/generative-ai";
import { z } from "zod";

import type { ResumeData, ResumeLanguage } from "@/app/(app)/editor/types";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";

// Name Gemini can reliably act on in its own instruction — not the resume's
// UI label ("Français"), an actual language name for the "respond in X"
// instruction.
const RESPONSE_LANGUAGE_NAMES: Record<ResumeLanguage, string> = {
  de: "Deutsch",
  en: "Englisch",
  fr: "Französisch",
};

export type ResumeMatchResult = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  strengths: string[];
};

// "app_quota_exceeded" is distinct from the per-user daily-check limit
// (that one lives in match-actions.ts): this is Google's free-tier quota,
// shared across every user of the app on one API key/project (currently
// 20 requests/day for the Flash models — see the AI Studio rate-limit
// dashboard, Google doesn't publish a stable number in docs).
export type ResumeMatchErrorCode =
  | "missing_api_key"
  | "app_quota_exceeded"
  | "invalid_api_key"
  | "request_failed"
  | "invalid_response";

export class ResumeMatchError extends Error {
  code: ResumeMatchErrorCode;

  constructor(message: string, code: ResumeMatchErrorCode, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
  }
}

// "gemini-flash-latest" is Google's maintained alias for the current
// recommended Flash model — pinning a dated model name (e.g.
// "gemini-2.5-flash") breaks without warning once Google phases it out for
// new API keys, which is what happened here.
const MODEL_NAME = "gemini-flash-latest";

// Clamp/round rather than reject on a slightly out-of-spec score (e.g. 102)
// — the schema constrains the model but doesn't guarantee it.
const resumeMatchResultSchema = z.object({
  score: z
    .number()
    .transform((value) => Math.max(0, Math.min(100, Math.round(value)))),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  suggestions: z.array(z.string()),
  strengths: z.array(z.string()),
});

function buildResumeSummary(resume: ResumeData): string {
  const lines: string[] = [];
  const p = resume.personal;

  lines.push(`Angestrebte Position / aktueller Titel: ${p.title || "-"}`);

  if (resume.experience.length) {
    lines.push("\nBerufserfahrung:");
    for (const exp of resume.experience) {
      lines.push(
        `- ${exp.position || "-"} bei ${exp.company || "-"} (${exp.from || "?"}–${exp.to || "?"}): ${exp.description || "-"}`,
      );
    }
  }

  if (resume.education.length) {
    lines.push("\nAusbildung:");
    for (const edu of resume.education) {
      lines.push(`- ${edu.degree || "-"}, ${edu.institution || "-"} (${edu.from || "?"}–${edu.to || "?"})`);
    }
  }

  if (resume.skills.length) {
    lines.push("\nFähigkeiten:");
    lines.push(resume.skills.map((s) => `${s.name} (${s.level}/5)`).join(", "));
  }

  if (resume.languages.length) {
    lines.push("\nSprachen:");
    lines.push(resume.languages.map((l) => `${l.name} (${l.level})`).join(", "));
  }

  if (resume.certificates.length) {
    lines.push("\nZertifikate:");
    lines.push(resume.certificates.map((c) => `${c.title} (${c.issuer}, ${c.date})`).join(", "));
  }

  if (resume.projects.length) {
    lines.push("\nProjekte:");
    for (const proj of resume.projects) {
      lines.push(`- ${proj.title}: ${proj.description}`);
    }
  }

  if (resume.freitext.content.trim()) {
    lines.push(`\n${resume.freitext.title || "Über mich"}: ${resume.freitext.content}`);
  }

  return lines.join("\n").trim() || "(Lebenslauf ist noch leer.)";
}

const responseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    score: {
      type: SchemaType.INTEGER,
      description: "Prozentualer Match-Score zwischen 0 (keine Übereinstimmung) und 100 (perfekte Übereinstimmung).",
    },
    matchedSkills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Fähigkeiten/Anforderungen aus der Stellenausschreibung, die im Lebenslauf erkennbar vorhanden sind.",
    },
    missingSkills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Anforderungen aus der Stellenausschreibung, die im Lebenslauf fehlen oder nicht erkennbar sind.",
    },
    suggestions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Konkrete, umsetzbare Vorschläge, um den Lebenslauf besser auf diese Stelle zuzuschneiden.",
    },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Die stärksten Argumente des Kandidaten für genau diese Stelle.",
    },
  },
  required: ["score", "matchedSkills", "missingSkills", "suggestions", "strengths"],
};

export async function matchResumeAgainstJobPosting(
  resume: ResumeData,
  jobPosting: string,
): Promise<ResumeMatchResult> {
  const dict = await getDictionary();
  const t = dict.editor.jobMatch;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ResumeMatchError(t.errorMissingApiKey, "missing_api_key");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const responseLanguage = RESPONSE_LANGUAGE_NAMES[resume.language];
  const prompt = `Du bist ein erfahrener Recruiting-Assistent. Vergleiche den folgenden Lebenslauf mit der Stellenausschreibung und bewerte, wie gut sie zueinander passen. Antworte ausschließlich auf ${responseLanguage} — sowohl die Fließtext-Vorschläge als auch die einzelnen Skill-/Stärken-Einträge müssen auf ${responseLanguage} formuliert sein, unabhängig davon, in welcher Sprache Lebenslauf oder Stellenausschreibung verfasst sind.

LEBENSLAUF:
${buildResumeSummary(resume)}

STELLENAUSSCHREIBUNG:
${jobPosting}`;

  let text: string;
  try {
    const result = await model.generateContent(prompt);
    text = result.response.text();
  } catch (error) {
    console.error("[resume-match] Gemini generateContent failed:", error);

    if (error instanceof GoogleGenerativeAIFetchError) {
      if (error.status === 429) {
        throw new ResumeMatchError(t.errorAppQuota, "app_quota_exceeded", { cause: error });
      }
      if (error.status === 401 || error.status === 403) {
        throw new ResumeMatchError(t.errorInvalidApiKey, "invalid_api_key", { cause: error });
      }
    }

    throw new ResumeMatchError(t.errorRequestFailed, "request_failed", { cause: error });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ResumeMatchError(t.errorInvalidResponseJson, "invalid_response");
  }

  const validated = resumeMatchResultSchema.safeParse(parsed);
  if (!validated.success) {
    throw new ResumeMatchError(t.errorInvalidResponseShape, "invalid_response");
  }

  return validated.data;
}
