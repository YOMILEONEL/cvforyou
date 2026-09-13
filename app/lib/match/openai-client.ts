import "server-only";

import OpenAI from "openai";
import { z } from "zod";

import type { ResumeData, ResumeLanguage } from "@/app/(app)/editor/types";
import { getDictionary } from "@/app/lib/i18n/get-dictionary";

// Name the model can reliably act on in its own instruction, not the resume's
// UI label ("Français"), an actual language name for the "respond in X"
// instruction.
const RESPONSE_LANGUAGE_NAMES: Record<ResumeLanguage, string> = {
  de: "Deutsch",
  en: "Englisch",
  fr: "Französisch",
};

export type ResumeMatchResult = {
  companyName: string;
  jobTitle: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  strengths: string[];
};

// "app_quota_exceeded" is distinct from the per-user daily-check limit
// (that one lives in match-actions.ts): this is a 429 from OpenAI itself,
// either a rate limit or the account running out of credit, shared across
// every user of the app on one API key.
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

// The cheapest current OpenAI model. More than accurate enough for a
// structured resume/job-posting comparison task like this one.
const MODEL_NAME = "gpt-5-nano";

// Clamp/round rather than reject on a slightly out-of-spec score (e.g. 102):
// the schema constrains the model but doesn't guarantee it.
const resumeMatchResultSchema = z.object({
  companyName: z.string(),
  jobTitle: z.string(),
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

// Structured Outputs schema for the Responses API (app/lib/match/openai-client.ts
// keeps this separate from the zod schema below, same split as before: this
// one constrains the model's generation, the zod one validates what comes
// back).
const responseSchema = {
  type: "object",
  properties: {
    companyName: {
      type: "string",
      description: "Name des Unternehmens aus der Stellenausschreibung, unverändert übernommen (nicht übersetzt). Leerer String, falls nicht eindeutig erkennbar.",
    },
    jobTitle: {
      type: "string",
      description: "Positions-/Stellenbezeichnung aus der Stellenausschreibung, unverändert übernommen (nicht übersetzt). Leerer String, falls nicht eindeutig erkennbar.",
    },
    score: {
      type: "number",
      description: "Prozentualer Match-Score zwischen 0 (keine Übereinstimmung) und 100 (perfekte Übereinstimmung).",
    },
    matchedSkills: {
      type: "array",
      items: { type: "string" },
      description: "Fähigkeiten/Anforderungen aus der Stellenausschreibung, die im Lebenslauf erkennbar vorhanden sind.",
    },
    missingSkills: {
      type: "array",
      items: { type: "string" },
      description: "Anforderungen aus der Stellenausschreibung, die im Lebenslauf fehlen oder nicht erkennbar sind.",
    },
    suggestions: {
      type: "array",
      items: { type: "string" },
      description: "Konkrete, umsetzbare Vorschläge, um den Lebenslauf besser auf diese Stelle zuzuschneiden.",
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description: "Die stärksten Argumente des Kandidaten für genau diese Stelle.",
    },
  },
  required: ["companyName", "jobTitle", "score", "matchedSkills", "missingSkills", "suggestions", "strengths"],
  additionalProperties: false,
};

export async function matchResumeAgainstJobPosting(
  resume: ResumeData,
  jobPosting: string,
): Promise<ResumeMatchResult> {
  const dict = await getDictionary();
  const t = dict.editor.jobMatch;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new ResumeMatchError(t.errorMissingApiKey, "missing_api_key");
  }

  const client = new OpenAI({ apiKey });

  const responseLanguage = RESPONSE_LANGUAGE_NAMES[resume.language];
  const prompt = `Du bist ein erfahrener Recruiting-Assistent. Vergleiche den folgenden Lebenslauf mit der Stellenausschreibung und bewerte, wie gut sie zueinander passen. Antworte ausschließlich auf ${responseLanguage}. Sowohl die Fließtext-Vorschläge als auch die einzelnen Skill-/Stärken-Einträge müssen auf ${responseLanguage} formuliert sein, unabhängig davon, in welcher Sprache Lebenslauf oder Stellenausschreibung verfasst sind. Extrahiere außerdem den Namen des Unternehmens (companyName) und die Positionsbezeichnung (jobTitle) aus der Stellenausschreibung, jeweils unverändert und nicht übersetzt; falls nicht eindeutig erkennbar, jeweils einen leeren String zurückgeben.

LEBENSLAUF:
${buildResumeSummary(resume)}

STELLENAUSSCHREIBUNG:
${jobPosting}`;

  let text: string;
  try {
    const response = await client.responses.create({
      model: MODEL_NAME,
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "resume_match_result",
          schema: responseSchema,
          strict: true,
        },
      },
    });
    text = response.output_text;
  } catch (error) {
    console.error("[resume-match] OpenAI request failed:", error);

    if (error instanceof OpenAI.RateLimitError) {
      throw new ResumeMatchError(t.errorAppQuota, "app_quota_exceeded", { cause: error });
    }
    if (error instanceof OpenAI.AuthenticationError || error instanceof OpenAI.PermissionDeniedError) {
      throw new ResumeMatchError(t.errorInvalidApiKey, "invalid_api_key", { cause: error });
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
