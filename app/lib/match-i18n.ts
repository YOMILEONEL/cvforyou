import type { ResumeLanguage } from "@/app/(app)/editor/types";

// Labels for the job-match result card. Only the labels framing the AI's
// own (language-dependent) answer are translated here — the rest of the
// job-match panel (textarea, button, error messages) stays in the app's
// German UI on purpose, same boundary as the rest of the editor chrome.

type MatchUiStrings = {
  matchScoreLabel: string;
  matchedSkillsTitle: string;
  missingSkillsTitle: string;
  suggestionsTitle: string;
  strengthsTitle: string;
};

export const MATCH_UI_STRINGS: Record<ResumeLanguage, MatchUiStrings> = {
  de: {
    matchScoreLabel: "Match-Score",
    matchedSkillsTitle: "Passende Fähigkeiten",
    missingSkillsTitle: "Fehlende Fähigkeiten",
    suggestionsTitle: "Verbesserungsvorschläge",
    strengthsTitle: "Deine Stärken für diese Stelle",
  },
  en: {
    matchScoreLabel: "Match Score",
    matchedSkillsTitle: "Matched Skills",
    missingSkillsTitle: "Missing Skills",
    suggestionsTitle: "Suggestions for Improvement",
    strengthsTitle: "Your Strengths for This Role",
  },
  fr: {
    matchScoreLabel: "Score de correspondance",
    matchedSkillsTitle: "Compétences correspondantes",
    missingSkillsTitle: "Compétences manquantes",
    suggestionsTitle: "Suggestions d'amélioration",
    strengthsTitle: "Vos atouts pour ce poste",
  },
};
