# AI-Agent: Stellenabgleich (Gemini)

Der Editor hat einen Tab **„Stellenabgleich"**, der einen Lebenslauf gegen
den Text einer Stellenausschreibung bewertet: Match-Score, passende/fehlende
Fähigkeiten, Verbesserungsvorschläge, Stärken. Das läuft über die
**Gemini API (Google AI Studio)** — nicht über Anthropic/Claude, das war
eine bewusste Entscheidung wegen des kostenlosen Tiers (siehe
[„Warum Gemini und nicht Claude"](#warum-gemini-und-nicht-claude) unten).

## Beteiligte Dateien

| Datei | Rolle |
|---|---|
| `app/lib/match/gemini-client.ts` | Gemini-Client, Prompt-Bau, Structured-Output-Schema, Fehler-Klassifizierung |
| `app/lib/match-actions.ts` | Server Action `matchResumeToJob` — Auth, Validierung, Rate-Limit, Aufruf des Gemini-Clients |
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
      4. matchResumeAgainstJobPosting(resume, jobPosting)  [Gemini-Client]
         a. Lebenslauf-Daten → Klartext-Zusammenfassung
         b. Prompt + responseSchema an Gemini senden
         c. JSON-Antwort parsen, mit zod validieren
      5. Bei Fehler in Schritt 4: INSERT aus Schritt 3 wieder löschen
         (der Nutzer bekommt seinen Tages-Check zurück)
  ← { status: "success", result } | { status: "error", error, code }
```

Der Lebenslauf wird **direkt aus dem React-State des Editors** übergeben,
nicht aus der Datenbank neu geladen — der Abgleich funktioniert also auch
mit noch nicht gespeicherten Änderungen.

## Structured Output statt Freitext-Parsing

Der Prompt wird nicht als Freitext an Gemini geschickt und die Antwort
dann mit Regex/Heuristik geparst — stattdessen erzwingt
`generationConfig.responseSchema` (siehe `gemini-client.ts`) ein festes
JSON-Schema:

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
und der Score auf `0–100` geklemmt — das Schema zwingt das Modell zu einer
bestimmten Form, garantiert aber nicht hundertprozentig gültige Werte.

## Zwei getrennte Rate-Limits

Das ist der Teil, der am leichtesten zu verwechseln ist — es gibt **zwei
unabhängige Begrenzungen**, die beide zu „geht gerade nicht" führen, aber aus
komplett unterschiedlichen Gründen:

| | Wer begrenzt? | Umfang | Wo im Code? |
|---|---|---|---|
| **Pro-Nutzer-Limit** | CVio selbst (Produktentscheidung) | 1 Check pro Nutzer pro Kalendertag | `resume_match_usage`-Tabelle, Primary Key `(user_id, checked_on)` |
| **App-weites Google-Kontingent** | Google (Gratis-Tier) | Aktuell **RPD 20 / RPM 5** für die Flash-Modelle — **für das ganze Google-Cloud-Projekt zusammen**, nicht pro Nutzer (siehe Google AI Studio → „Limite de débit") | HTTP 429 von Gemini, abgefangen in `gemini-client.ts` |

**Warum ein Insert-first-Ansatz für das Pro-Nutzer-Limit?** Die Tabelle hat
`(user_id, checked_on)` als Primary Key. `matchResumeToJob` versucht *zuerst*,
eine Zeile für heute einzufügen — noch bevor Gemini überhaupt aufgerufen
wird. Ein Unique-Constraint-Verstoß (Postgres-Fehlercode `23505`) bedeutet
dann eindeutig „heute schon genutzt". Das ist atomar: Es gibt kein
Read-then-Write-Zeitfenster, in dem zwei parallele Requests sich beide für
berechtigt halten.

**Warum wird die Zeile bei einem Gemini-Fehler wieder gelöscht?** Weil der
Check erst *nach* dem erfolgreichen Insert an Gemini geschickt wird — schlägt
der Gemini-Call fehl (Netzwerkfehler, App-weites Kontingent aufgebraucht,
ungültige Antwort), hat der Nutzer keinen Nutzen aus seinem Tages-Check
gezogen. `match-actions.ts` löscht die Zeile deshalb im `catch`-Block wieder,
damit ein fehlgeschlagener Versuch nicht auf Kosten des Nutzers geht.

## Fehlercodes

`ResumeMatchError` (in `gemini-client.ts`) trägt einen `code`, der bis ins
UI durchgereicht wird (`MatchErrorCode` in `match-actions.ts`):

| Code | Bedeutung | Auslöser |
|---|---|---|
| `empty_input` | Stellenausschreibung leer | Client-seitige Validierung |
| `input_too_long` | > 8000 Zeichen | Client-seitige Validierung |
| `not_authenticated` | Kein eingeloggter Nutzer | `supabase.auth.getUser()` |
| `daily_limit_reached` | Pro-Nutzer-Tageslimit erreicht | Postgres `23505` beim Insert |
| `missing_api_key` | `GEMINI_API_KEY` fehlt auf dem Server | Prüfung vor dem Gemini-Aufruf |
| `app_quota_exceeded` | Googles App-weites Kontingent für heute aufgebraucht | Gemini antwortet mit HTTP 429 |
| `invalid_api_key` | Key ungültig/widerrufen | Gemini antwortet mit HTTP 401/403 |
| `request_failed` | Sonstiger Netzwerk-/API-Fehler | alles andere aus `generateContent()` |
| `invalid_response` | Antwort kein gültiges JSON oder besteht die zod-Validierung nicht | Nach dem Gemini-Aufruf |
| `unexpected` | Unbekannter Fehler | Fallback in `match-actions.ts` |

Im UI (`job-match-panel.tsx`) werden `daily_limit_reached` und
`app_quota_exceeded` visuell abgehoben (gestrichelte Box mit Label „Dein
Tageslimit" bzw. „App-weites Kontingent") statt als einfache rote
Fehlerzeile — der Nutzer soll sofort verstehen, dass hier kein Bug vorliegt,
sondern eine Kapazitätsgrenze, und wer die überschritten hat (er selbst oder
die App insgesamt).

## Modellwahl: `gemini-flash-latest`

Der Code pinnt **nicht** einen datierten Modellnamen wie `gemini-2.5-flash`,
sondern den von Google gepflegten Alias `gemini-flash-latest`. Grund: Genau
dieses Problem ist beim Aufbau der Funktion aufgetreten — `gemini-2.5-flash`
wurde für neu erstellte API-Keys ohne Vorwarnung gesperrt
(„This model … is no longer available to new users"), obwohl es in der
Modell-Liste noch auftauchte. Der `-latest`-Alias verschiebt dieses Risiko
zu Google, statt dass CVio bei jeder Modell-Ablösung erneut brechen kann.

## Warum Gemini und nicht Claude

Anthropic (Claude) hat **keinen dauerhaft kostenlosen API-Tier** — jede
Nutzung erfordert eine hinterlegte Zahlungsmethode, auch wenn die Kosten pro
Anfrage minimal wären. Für ein privates Freundeskreis-Projekt ohne Budget
war das der ausschlaggebende Punkt für Google AI Studio / Gemini
(kostenloses Tageskontingent ohne Kreditkarte).

## Konfiguration

```
# .env.local
GEMINI_API_KEY=…   # https://aistudio.google.com/apikey
```

Der Key wird ausschließlich serverseitig verwendet (`gemini-client.ts`
importiert `"server-only"`) — er landet nie im Browser-Bundle.

## Bekannte Grenzen

- Keine Undo/Historie vergangener Abgleiche — nur das letzte Ergebnis wird
  im React-State gehalten, ein Seiten-Reload verwirft es.
- Der Gemini-Aufruf ist nicht gestreamt — der Nutzer wartet auf die
  vollständige Antwort (bei `gemini-flash-latest` typischerweise wenige
  Sekunden).
- Kein Retry mit Backoff bei transienten Fehlern (z. B. 503) — der Nutzer
  muss manuell erneut klicken (was dank Rollback-Logik seinen Tages-Check
  nicht kostet).
