# CVforYou

Ein privater, nicht-kommerzieller Lebenslauf-Generator für den
Freundes- und Bekanntenkreis: Lebenslauf im Editor zusammenstellen, aus
14 Vorlagen wählen, als PDF exportieren und optional per KI gegen eine
Stellenausschreibung abgleichen lassen.

Gebaut mit Next.js 16 (App Router), Supabase (Auth, Postgres, Storage) und
der OpenAI API für den KI-Stellenabgleich.

## Features

- **Editor** mit Live-Vorschau: persönliche Daten, Berufserfahrung,
  Ausbildung, Fähigkeiten, Sprachen, Zertifikate, Projekte, Referenzen,
  Freitext. Sektionen sind ein-/ausblendbar und per Drag & Drop sortierbar.
- **14 Vorlagen** in vier Stilrichtungen (Minimalistisch, Modern, Kreativ,
  Klassisch), inkl. einer ATS-freundlichen Vorlage ohne Foto.
- **PDF-Export**: serverseitig gerendert (Puppeteer/Chromium), sieht exakt
  wie die Live-Vorschau aus.
- **KI-Stellenabgleich** (OpenAI): vergleicht den Lebenslauf mit einer
  eingefügten Stellenausschreibung und liefert Match-Score, fehlende
  Skills und Verbesserungsvorschläge. Ein Check pro Nutzer und Tag.
- **Auto-Save** im Editor (debounced), Foto-Upload direkt zu Supabase
  Storage.
- **Auth** über Supabase (E-Mail/Passwort), Daten pro Nutzer isoliert über
  Row Level Security.

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Datenbank/Auth/Storage | Supabase (Postgres + RLS, Supabase Auth, Supabase Storage) |
| PDF-Rendering | Puppeteer (lokal) / `puppeteer-core` + `@sparticuz/chromium` (serverless) |
| KI-Stellenabgleich | OpenAI API (`gpt-5-nano`) |
| Validierung | zod |

## Setup

### Voraussetzungen

- Node.js (siehe `package.json`/`.nvmrc`, falls vorhanden, sonst aktuelle
  LTS-Version)
- Ein [Supabase](https://supabase.com)-Projekt
- Ein [OpenAI](https://platform.openai.com/api-keys)-API-Key mit hinterlegtem
  Zahlungsmittel (für den Stellenabgleich, Kosten pro Check sind minimal)

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen

```bash
cp .env.local.example .env.local
```

Dann in `.env.local` eintragen:

| Variable | Woher |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase-Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase-Dashboard → Project Settings → API |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) (Zahlungsmittel im Konto nötig) |

`.env.local` ist gitignored. In `.env.local.example` sollten daher nie
echte Werte landen: diese Datei ist eingecheckt und dient nur als Vorlage
mit Platzhaltern.

### 3. Datenbank-Schema anlegen

Den Inhalt von [`supabase/schema.sql`](supabase/schema.sql) im Supabase
Dashboard → SQL Editor ausführen. Die Datei ist mehrfach ausführbar
(`if not exists` / Policies werden gedroppt und neu angelegt), lässt sich
also bei Schema-Updates gefahrlos erneut ausführen.

### 4. Dev-Server starten

```bash
npm run dev
```

App läuft auf [http://localhost:3000](http://localhost:3000).

## Scripts

| Befehl | Zweck |
|---|---|
| `npm run dev` | Dev-Server (Turbopack) |
| `npm run build` | Produktions-Build |
| `npm run start` | Produktions-Server (nach `build`) |
| `npm run lint` | ESLint |
| `npm run generate:previews` | Generiert die Vorlagen-Vorschaubilder (`scripts/generate-template-previews.ts`) |

## Projektstruktur

```
app/
  (app)/              Eingeloggter Bereich: Dashboard, Editor
  (auth)/             Login, Registrierung
  api/resumes/[id]/pdf/  Route Handler für PDF-Export
  components/         Landingpage-Komponenten
  lib/                Server Actions, Supabase-Clients, PDF-Rendering, OpenAI-Client
  datenschutz/, impressum/, kontakt/   Rechtliche Pflichtseiten
supabase/
  schema.sql          Tabellen, RLS-Policies, Storage-Bucket-Setup
docs/                 Vertiefende Doku zu einzelnen Subsystemen (siehe unten)
```

## Weiterführende Dokumentation

Diese README deckt den Überblick ab. Für die Details einzelner Subsysteme:

- [**Auth**](docs/auth.md): Supabase Auth, Middleware/Session-Refresh,
  welcher Supabase-Client wo verwendet wird, RLS als Autorisierungsschicht.
- [**AI-Agent (Stellenabgleich)**](docs/ai-agent.md): OpenAI-Integration,
  Structured Output, die zwei getrennten Rate-Limits (pro Nutzer vs.
  App-weites Google-Kontingent), Fehlercodes.
- [**API-Anfragen-Flow**](docs/api-request-flow.md): Server Components vs.
  Server Actions vs. der eine Route Handler, Persistenzmodell,
  Datei-Upload-Flow.
- [**PDF-Export**](docs/pdf-export.md): wie der Lebenslauf zu PDF wird,
  der lokale/serverless Puppeteer-Split, XSS-Schutz beim HTML-Rendering.
- [**Requirements-Engineering**](docs/requirements-lebenslauf-generator.md):
  die ursprüngliche Anforderungsanalyse, aus der das Projekt entstanden ist
  (Stand: Planungsphase, nicht alle Punkte sind 1:1 umgesetzt).

## Deployment

Gedacht für [Vercel](https://vercel.com) + Supabase. Beim Deployment:

- Alle drei Env-Vars (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`) als Vercel-Project-Env-Vars
  hinterlegen.
- `supabase/schema.sql` gegen das Produktions-Supabase-Projekt ausführen
  (separates Projekt empfohlen, nicht dasselbe wie lokal/Dev).
- `next.config.ts` enthält bereits die nötige `outputFileTracingIncludes`-
  Konfiguration für den serverless-Chromium-Build (siehe
  [docs/pdf-export.md](docs/pdf-export.md)). Hier ist nichts weiter nötig.

## Rechtliches

Privates, nicht-kommerzielles Projekt ohne Gewinnerzielungsabsicht. Details
siehe [`/impressum`](app/impressum/page.tsx) und
[`/datenschutz`](app/datenschutz/page.tsx).
