# PDF-Export

Der „Als PDF exportieren"-Link im Editor rendert den Lebenslauf serverseitig
mit einem headless Chromium zu einer echten PDF-Datei — kein
Browser-`window.print()`, kein PDF-Library, die HTML/CSS nur teilweise
unterstützt.

## Beteiligte Dateien

| Datei | Rolle |
|---|---|
| `app/api/resumes/[id]/pdf/route.ts` | Route Handler, orchestriert die drei Schritte unten |
| `app/lib/pdf/render-resume-html.ts` | `ResumeData` → eigenständiger HTML/CSS-String |
| `app/lib/pdf/escape-html.ts` | XSS-Schutz für Nutzereingaben im HTML |
| `app/lib/pdf/render-pdf.ts` | HTML-String → PDF-Bytes via Puppeteer/Chromium |
| `next.config.ts` | `outputFileTracingIncludes` für den Chromium-Binary auf Vercel |

## Drei Schritte

```
GET /api/resumes/:id/pdf
  1. getResume(id)                                    → ResumeData + Template
  2. renderResumeHtml(data, sectionMeta, templateName) → HTML-String
  3. renderPdf(html)                                   → PDF-Bytes (Puppeteer)
  ← NextResponse(pdf, Content-Type: application/pdf, Content-Disposition: attachment)
```

## Warum eigenes HTML statt der React-Komponenten wiederverwenden?

`render-resume-html.ts` baut das Layout **komplett neu** als reinen
HTML/CSS-String, statt die vorhandenen React-Preview-Komponenten
(`resume-preview.tsx`) serverseitig zu rendern. Der Grund steht als
Kommentar im Code: Die Preview-Komponenten nutzen Tailwind-Utility-Klassen,
die nur über das **kompilierte Stylesheet der laufenden App** aufgelöst
werden. Ein headless Browser, der nur einen isolierten HTML-String über
`page.setContent()` bekommt, hat dieses Stylesheet nicht — die Klassen
blieben wirkungslos. Die vier Templates sind deshalb als Inline-CSS in
`render-resume-html.ts` dupliziert, bewusst getrennt von der
React-Preview-Implementierung.

**Konsequenz für Änderungen:** Ein Layout-Update an einem Template muss
**an zwei Stellen** gemacht werden — `resume-preview.tsx` (Live-Vorschau im
Editor) und `render-resume-html.ts` (PDF-Export) — sonst laufen Vorschau und
exportiertes PDF optisch auseinander.

## XSS-Schutz

Jeder Nutzereingabe-Wert, der in den HTML-String eingebettet wird, läuft
durch `escapeHtml()`. Das ist notwendig, weil `render-resume-html.ts`
String-Interpolation statt eines JSX-Renderers nutzt (JSX escaped
automatisch, ein Template-String tut das nicht) — ohne `escapeHtml` könnte
ein bösartiger Lebenslauf-Text (z. B. im Freitext-Feld) Markup injizieren,
das im PDF landet.

## Lokal vs. Serverless: zwei Puppeteer-Pfade

`render-pdf.ts` entscheidet zur Laufzeit anhand von
`process.env.VERCEL` / `process.env.AWS_LAMBDA_FUNCTION_NAME`, welcher Pfad
läuft:

| | Lokal (Dev) | Serverless (Vercel) |
|---|---|---|
| Paket | `puppeteer` (voll) | `puppeteer-core` + `@sparticuz/chromium` |
| Chromium | Vom Paket selbst heruntergeladen (~700 MB) | Brotli-komprimierter Build, für Function-Size-Limits gedacht |
| Warum getrennt? | `puppeteer` ist für lokale Entwicklung bequem, aber viel zu groß für ein Vercel-Deployment-Bundle | |

Beide Zweige werden über **dynamische Imports** geladen
(`await import("puppeteer")` bzw. `await import("puppeteer-core")`), damit
das jeweils ungenutzte Paket nie ausgewertet/gebundelt wird.

**Eine Besonderheit beim serverless Pfad:** `@sparticuz/chromium` liefert
`headless_shell`, das nur den „alten" Headless-Modus unterstützt. Seit
Puppeteer v22+ ist der neue Headless-Modus der Default — deshalb wird
`headless: "shell"` explizit sowohl an `defaultArgs()` als auch an
`launch()` übergeben. Ohne das würde Puppeteer versuchen, einen Modus zu
nutzen, den der komprimierte Chromium-Build gar nicht kann.

## Warum `outputFileTracingIncludes` in `next.config.ts`?

Vercels Build-Prozess versucht automatisch herauszufinden, welche Dateien
eine Serverless Function zur Laufzeit braucht (Output File Tracing), indem
es `import`/`require`-Aufrufe verfolgt. Der Chromium-Binary in
`@sparticuz/chromium/bin/` wird aber nicht importiert, sondern zur Laufzeit
über `fs` gelesen (`chromium.executablePath()`) — das Tracing sieht ihn
nicht automatisch. `next.config.ts` listet den Pfad deshalb explizit für
die PDF-Route, sonst würde die Function auf Vercel mit „Chromium nicht
gefunden" fehlschlagen, obwohl sie lokal einwandfrei läuft.

## Bekannte Grenzen

- Kein Seitenumbruch-Feintuning — sehr lange Lebensläufe können unschön
  über Seiten brechen (abhängig vom Chromium-PDF-Renderer, `format: "A4"`).
- Kein Caching des gerenderten PDFs — jeder Download rendert neu (für die
  erwartete Nutzungsgröße unkritisch).
- Puppeteer-Start hat spürbaren Cold-Start-Overhead auf Vercel — für einen
  On-Demand-Download akzeptiert, aber nicht für hochfrequente Aufrufe
  gedacht.
