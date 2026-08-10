# API-Anfragen-Flow

CVforYou hat **keine klassische REST-/JSON-API-Schicht**. Bis auf eine Ausnahme
(PDF-Export) läuft jede Client-Server-Kommunikation über Next.js **Server
Components** (lesen) und **Server Actions** (schreiben). Beides läuft im
selben Next.js-Prozess wie das Rendering, es gibt keinen separaten
Backend-Service.

## Die drei Muster im Überblick

| Muster | Wann? | Beispiel | Rückgabe |
|---|---|---|---|
| **Server Component + direkter DB-Zugriff** | Seiten-Load (lesen) | `app/(app)/dashboard/page.tsx` → `listResumes()` | React-Baum (HTML) |
| **Server Action** | Formular-Submit / Mutation vom Client aus | `saveResume`, `matchResumeToJob`, `login` | Typisiertes Result-Objekt, kein Redirect nötig |
| **Route Handler** | Client braucht eine Nicht-HTML-Antwort (Datei, Binärdaten) | `GET /api/resumes/[id]/pdf` | `NextResponse` mit beliebigem Content-Type |

Faustregel im Code: **Route Handler nur, wenn eine Server Action die
Antwort nicht liefern kann** (hier: eine PDF-Binärdatei mit
`Content-Disposition: attachment`, denn eine Server Action kann keinen
Datei-Download auslösen). Für alles andere: Server Component oder Server
Action.

## Lesen: Server Components rufen `app/lib/*.ts` direkt auf

Es gibt keinen Fetch/HTTP-Roundtrip zwischen Seite und Datenbank. Eine Seite
wie `app/(app)/dashboard/page.tsx` importiert `listResumes()` aus
`app/lib/resumes.ts` und ruft es **während des Server-Renderings** auf. Das
ist eine normale async-Funktion, kein API-Call:

```
dashboard/page.tsx  (Server Component, async)
  → listResumes()                     [app/lib/resumes.ts]
      → createClient()                [app/lib/supabase/server.ts]
      → supabase.auth.getUser()       (Redirect nach /login, falls kein User)
      → supabase.from("resumes").select(...).eq("user_id", userId)
  ← ResumeSummary[]
```

`app/lib/resumes.ts` kapselt jeden Lese-Zugriff auf `resumes` und erzwingt
darin `requireUser()`: jede exportierte Funktion (`listResumes`,
`getResume`, `createResumeAndRedirect`) beginnt damit. Das ist die zweite
Verteidigungslinie zusätzlich zu RLS (siehe `docs/auth.md`): Selbst wenn RLS
fehlkonfiguriert wäre, filtert der Code trotzdem nach `user_id`.

## Schreiben: Server Actions

Mutationen laufen über `"use server"`-Funktionen, die der Client direkt wie
eine lokale async-Funktion aufruft (Next.js baut den RPC-Mechanismus intern
auf). Zwei Varianten kommen im Projekt vor:

**1. Formular-gebunden über `useActionState`**: für klassische
Formular-Submits mit progressive enhancement (funktioniert auch ohne JS):

```tsx
// register-form.tsx
const [state, formAction, pending] = useActionState<AuthState, FormData>(register, undefined);
// <form action={formAction}>
```

`login`, `register` (`auth-actions.ts`) folgen diesem Muster.

**2. Direkter Aufruf aus Event-Handlern**: wenn der Client mehr Kontrolle
über *wann* die Action läuft braucht (Debounce, `useTransition` für
Pending-State ohne Formular):

```tsx
// editor-client.tsx: Autosave, 1200ms Debounce nach der letzten Änderung
saveResume(resumeId, { title, templateName, data: resume, sectionMeta: sections })

// job-match-panel.tsx: Button-Klick, kein <form>
startTransition(async () => {
  const result = await matchResumeToJob(resume, jobPosting);
  setState(result);
});
```

`saveResume`, `deleteResume` (`resume-actions.ts`) und `matchResumeToJob`
(`match-actions.ts`) folgen diesem Muster. Sie geben ein Result-Objekt
zurück (`{ error?: string }`, `MatchResumeState`) statt zu redirecten. Der
Aufrufer entscheidet selbst, was mit Erfolg/Fehler passiert.

**Wichtig:** Jede Server Action prüft Auth **selbst** erneut
(`supabase.auth.getUser()`), obwohl die Middleware (`proxy.ts`) die Route
bereits schützt. Server Actions sind eigene Endpunkte mit eigener
Request-Pipeline; der Seiten-Schutz der Middleware deckt sie nicht
automatisch ab.

## Die eine Ausnahme: Route Handler für PDF-Export

`app/api/resumes/[id]/pdf/route.ts` ist der einzige klassische
Route Handler im Projekt:

```
GET /api/resumes/:id/pdf
  → getResume(id)                       [app/lib/resumes.ts, Auth + RLS]
  → renderResumeHtml(data, sections, template)
  → renderPdf(html)                     [Puppeteer/Chromium, siehe docs/pdf-export.md]
  ← NextResponse(pdf, { Content-Type: "application/pdf", Content-Disposition: "attachment" })
```

Der `<a href="/api/resumes/[id]/pdf">`-Link im Editor triggert einen
normalen Browser-Download. Das ist der Grund, warum das kein Server Action
sein kann: Server Actions liefern serialisierbare Werte an React zurück,
keinen Datei-Download-Response.

## Persistenzmodell: Ein JSONB-Dokument pro Lebenslauf

`resumes.data` und `resumes.section_meta` sind `jsonb`-Spalten, die exakt
die Client-seitigen Typen `ResumeData` / `SectionMeta[]`
(`app/(app)/editor/types.ts`) spiegeln. Bewusste Entscheidung
(siehe Kommentar in `supabase/schema.sql`): Ein Lebenslauf hat keine
Cross-Resume-Reporting-Anforderungen (privates, nicht-kommerzielles
Projekt), daher normalisiert das Schema `experience`/`education`/etc.
**nicht** in eigene Tabellen. Ein einzelnes JSON-Dokument pro Resume ist
einfacher und für diesen Anwendungsfall ausreichend.

**Schema-Drift wird beim Lesen aufgefangen, nicht in der DB:**
`mergeResumeData()` in `resumes.ts` merged gespeicherte JSON-Daten auf die
aktuellen `initialResumeData`-Defaults. Wird ein neues Feld zu `ResumeData`
hinzugefügt, fehlt es in älteren gespeicherten Datensätzen. Ohne diesen
Merge würden Formularfelder von unkontrolliert (`undefined`) zu kontrolliert
wechseln, sobald der Nutzer zu tippen beginnt (React-Warnung + Bugs).

## Datei-Uploads: Supabase Storage, nicht die eigene API

Foto-Uploads (`photo-upload.tsx`) gehen **direkt vom Browser** an Supabase
Storage, nicht über eine Next.js-Route:

```
PhotoUpload (Client Component)
  → createClient()                          [app/lib/supabase/client.ts]
  → supabase.storage.from("resume-photos").upload(`${userId}/${resumeId}-${ts}.${ext}`, file)
```

Der Bucket ist **public-read** (siehe `supabase/schema.sql`), bewusst, weil
das Foto später auf einer PDF landet, die der Nutzer extern teilt, und weil
Puppeteer das Bild beim PDF-Rendering ohne Auth-Header abrufen muss.
Schreibzugriff ist über RLS auf den ersten Pfad-Bestandteil (`user_id`)
beschränkt: ein Nutzer kann nur unter seiner eigenen ID hochladen, auch
wenn der Client-Code das nicht selbst durchsetzt.

## Zusammenfassung: Wo läuft was?

```
Browser
  │
  ├─ Seiten-Navigation ───────────────► Server Component (RSC) ──► app/lib/*.ts ──► Supabase (RLS)
  │
  ├─ Formular-Submit / Button-Klick ──► Server Action ("use server") ──► app/lib/*.ts ──► Supabase (RLS)
  │
  ├─ PDF-Download-Link ────────────────► Route Handler (app/api/…) ──► Puppeteer ──► Response
  │
  └─ Datei-Upload (Foto) ──────────────► Supabase Storage direkt (kein Next.js-Hop)
```
