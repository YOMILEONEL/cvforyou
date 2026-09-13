# AI-Agent: Stellenabgleich (OpenAI)

Der Editor hat einen Tab **„Stellenabgleich"**, der einen Lebenslauf gegen
den Text einer Stellenausschreibung bewertet: Match-Score, passende/fehlende
Fähigkeiten, Verbesserungsvorschläge, Stärken. Das läuft über die
**OpenAI API** mit dem Modell **`gpt-5-nano`**, dem aktuell günstigsten
OpenAI-Modell (siehe [„Warum OpenAI"](#warum-openai) unten für die
Vorgeschichte mit Gemini).

## Beteiligte Dateien

| Datei | Rolle |
|---|---|
| `app/lib/match/openai-client.ts` | OpenAI-Client, Prompt-Bau, Structured-Output-Schema, Fehler-Klassifizierung |
| `app/lib/match-actions.ts` | Server Action `matchResumeToJob`, Auth, Validierung, Rate-Limit, Aufruf des OpenAI-Clients |
| `app/(app)/editor/job-match-panel.tsx` | UI: Textarea für die Stellenausschreibung, Ergebnis-Karte, Fehleranzeige |
| `supabase/schema.sql` (Tabelle `resume_match_usage`) | Persistenz für das Pro-Nutzer-Tageslimit |

## Ablauf einer Anfrage

```
JobMatchPanel (Client)
  → matchResumeToJob(resumeData, jobPosting)      [Server Action]
      1. Eingabe validieren (nicht leer, ≤ 8000 Zeichen)
      2. Auth prüfen (supabase.auth.getUser())
      3. INSERT in resume_match_usage (user_id, checked_on: heute)
         → schlägt mit 23505 fehl, wenn heute schon genutzt
      4. matchResumeAgainstJobPosting(resume, jobPosting)  [OpenAI-Client]
         a. Lebenslauf-Daten → Klartext-Zusammenfassung
         b. Prompt + JSON-Schema an die Responses API senden
         c. JSON-Antwort parsen, mit zod validieren
      5. Bei Fehler in Schritt 4: INSERT aus Schritt 3 wieder löschen
         (der Nutzer bekommt seinen Tages-Check zurück)
  ← { status: "success", result } | { status: "error", error, code }
```

Der Lebenslauf wird **direkt aus dem React-State des Editors** übergeben,
nicht aus der Datenbank neu geladen. Der Abgleich funktioniert also auch
mit noch nicht gespeicherten Änderungen.

## Structured Output statt Freitext-Parsing

Der Prompt wird nicht als Freitext geschickt und die Antwort dann mit
Regex/Heuristik geparst. Stattdessen erzwingt die **Responses API** über
`text.format` (Typ `json_schema`, `strict: true`) ein festes JSON-Schema
(siehe `openai-client.ts`):

```ts
{
  score: number,            // 0–100
  matchedSkills: string[],
  missingSkills: string[],
  suggestions: string[],
  strengths: string[],
}
```

Die Antwort wird zusätzlich mit `zod` validiert (`resumeMatchResultSchema`)
und der Score auf `0–100` geklemmt. Das Schema zwingt das Modell zu einer
bestimmten Form, garantiert aber nicht hundertprozentig gültige Werte.

### Antwortsprache folgt der Lebenslauf-Sprache, nicht der App-UI

`matchResumeAgainstJobPosting` bekommt den kompletten `resume: ResumeData`
übergeben. `resume.language` (`"de" | "en" | "fr"`, dieselbe Einstellung
wie im Sprach-Umschalter unter „Vorlage" im Editor) steuert direkt die
Prompt-Instruktion:

```ts
const RESPONSE_LANGUAGE_NAMES: Record<ResumeLanguage, string> = {
  de: "Deutsch", en: "Englisch", fr: "Französisch",
};
```

Das Modell wird angewiesen, sowohl die Fließtext-Vorschläge als auch die
einzelnen Skill-/Stärken-Einträge in dieser Sprache zu formulieren,
unabhängig davon, in welcher Sprache die eingefügte Stellenausschreibung
selbst verfasst ist. Die vier Label-Überschriften im Ergebnis-Panel
(„Passende Fähigkeiten" etc.) übersetzen entsprechend mit, über
`MATCH_UI_STRINGS` in `app/lib/match-i18n.ts`: nur diese Labels, **nicht**
der Rest des Stellenabgleich-Panels (Textarea-Label, Button,
Fehlermeldungen zu Rate-Limits/Auth). Der bleibt bewusst deutsch, wie die
restliche Editor-Oberfläche auch (die App-UI ist insgesamt nicht
mehrsprachig, nur der erzeugte Lebenslauf selbst).

## Zwei getrennte Rate-Limits

Das ist der Teil, der am leichtesten zu verwechseln ist: es gibt **zwei
unabhängige Begrenzungen**, die beide zu „geht gerade nicht" führen, aber aus
komplett unterschiedlichen Gründen:

| | Wer begrenzt? | Umfang | Wo im Code? |
|---|---|---|---|
| **Pro-Nutzer-Limit** | CVforYou selbst (Produktentscheidung) | 1 Check pro Nutzer pro Kalendertag | `resume_match_usage`-Tabelle, Primary Key `(user_id, checked_on)` |
| **App-weites Kontingent** | OpenAI (Rate-Limit bzw. aufgebrauchtes Guthaben) | Abhängig vom Usage-Tier des OpenAI-Kontos, OpenAI veröffentlicht keine für alle gültige feste Zahl | HTTP 429 von OpenAI, abgefangen in `openai-client.ts` |

**Warum ein Insert-first-Ansatz für das Pro-Nutzer-Limit?** Die Tabelle hat
`(user_id, checked_on)` als Primary Key. `matchResumeToJob` versucht *zuerst*,
eine Zeile für heute einzufügen, noch bevor die KI überhaupt aufgerufen
wird. Ein Unique-Constraint-Verstoß (Postgres-Fehlercode `23505`) bedeutet
dann eindeutig „heute schon genutzt". Das ist atomar: Es gibt kein
Read-then-Write-Zeitfenster, in dem zwei parallele Requests sich beide für
berechtigt halten.

**Warum wird die Zeile bei einem Fehler wieder gelöscht?** Weil der Check
erst *nach* dem erfolgreichen Insert an OpenAI geschickt wird: schlägt der
Aufruf fehl (Netzwerkfehler, Kontingent aufgebraucht, ungültige Antwort),
hat der Nutzer keinen Nutzen aus seinem Tages-Check gezogen. `match-actions.ts`
löscht die Zeile deshalb im `catch`-Block wieder, damit ein fehlgeschlagener
Versuch nicht auf Kosten des Nutzers geht.

## Fehlercodes

`ResumeMatchError` (in `openai-client.ts`) trägt einen `code`, der bis ins
UI durchgereicht wird (`MatchErrorCode` in `match-actions.ts`):

| Code | Bedeutung | Auslöser |
|---|---|---|
| `empty_input` | Stellenausschreibung leer | Client-seitige Validierung |
| `input_too_long` | > 8000 Zeichen | Client-seitige Validierung |
| `not_authenticated` | Kein eingeloggter Nutzer | `supabase.auth.getUser()` |
| `daily_limit_reached` | Pro-Nutzer-Tageslimit erreicht | Postgres `23505` beim Insert |
| `missing_api_key` | `OPENAI_API_KEY` fehlt auf dem Server | Prüfung vor dem OpenAI-Aufruf |
| `app_quota_exceeded` | Rate-Limit oder Guthaben des OpenAI-Kontos aufgebraucht | OpenAI antwortet mit HTTP 429 (`RateLimitError`) |
| `invalid_api_key` | Key ungültig/widerrufen | OpenAI antwortet mit HTTP 401/403 (`AuthenticationError`/`PermissionDeniedError`) |
| `request_failed` | Sonstiger Netzwerk-/API-Fehler | alles andere aus `responses.create()` |
| `invalid_response` | Antwort kein gültiges JSON oder besteht die zod-Validierung nicht | Nach dem OpenAI-Aufruf |
| `unexpected` | Unbekannter Fehler | Fallback in `match-actions.ts` |

Im UI (`job-match-panel.tsx`) werden `daily_limit_reached` und
`app_quota_exceeded` visuell abgehoben (gestrichelte Box mit Label „Dein
Tageslimit" bzw. „App-weites Kontingent") statt als einfache rote
Fehlerzeile. Der Nutzer soll sofort verstehen, dass hier kein Bug vorliegt,
sondern eine Kapazitätsgrenze, und wer die überschritten hat (er selbst oder
die App insgesamt).

## Modellwahl: `gpt-5-nano`

Das aktuell günstigste OpenAI-Modell ($0.05 / 1 Mio. Input-Tokens, $0.40 /
1 Mio. Output-Tokens, Stand der Umstellung auf OpenAI), für eine strukturierte
Textvergleichsaufgabe wie diese mehr als ausreichend. Ein Lebenslauf-Abgleich
kostet dadurch Bruchteile eines Cents.

## Warum OpenAI

Ursprünglich lief dieses Feature über Google Gemini (dauerhaft kostenloses
Tageskontingent, kein Zahlungsmittel nötig, siehe Git-Historie). Das wurde
durch einen Wechsel bei Google unbrauchbar: Neu erstellte Gemini-API-Keys
bekommen inzwischen ausschließlich das neue `AQ.`-Auth-Key-Format, das die
Gemini API selbst mit `401 ACCESS_TOKEN_TYPE_UNSUPPORTED` ablehnt, ein zum
Zeitpunkt der Umstellung breit gemeldeter, ungelöster Bug auf Google-Seite,
unabhängig vom verwendeten SDK.

Anthropic (Claude) hat weiterhin **keinen dauerhaft kostenlosen API-Tier**,
das war schon vorher der Grund gegen Claude. OpenAI hat ebenfalls keinen
dauerhaften Gratis-Tier, ein hinterlegtes Zahlungsmittel ist Pflicht, aber
`gpt-5-nano` ist bei der geringen Nutzungsgröße dieses Projekts (max. ein
Check pro Nutzer pro Tag) so günstig, dass die tatsächlichen Kosten
vernachlässigbar sind, anders als bei Claudes Preisniveau.

## Konfiguration

```
# .env.local
OPENAI_API_KEY=…   # https://platform.openai.com/api-keys
```

Der Key wird ausschließlich serverseitig verwendet (`openai-client.ts`
importiert `"server-only"`). Er landet nie im Browser-Bundle.

## Bekannte Grenzen

- Keine Undo/Historie vergangener Abgleiche: nur das letzte Ergebnis wird
  im React-State gehalten, ein Seiten-Reload verwirft es.
- Der OpenAI-Aufruf ist nicht gestreamt: der Nutzer wartet auf die
  vollständige Antwort (bei `gpt-5-nano` typischerweise wenige Sekunden).
- Kein Retry mit Backoff bei transienten Fehlern (z. B. 503): der Nutzer
  muss manuell erneut klicken (was dank Rollback-Logik seinen Tages-Check
  nicht kostet).
