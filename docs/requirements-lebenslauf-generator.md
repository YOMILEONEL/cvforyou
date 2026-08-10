# Requirements-Engineering: Lebenslauf-Generator (Next.js)

## 1. Projektübersicht

**Ziel:** Eine Webanwendung, mit der Nutzer strukturiert Daten für einen Lebenslauf eingeben, verschiedene Vorlagen (Templates) auswählen und den fertigen Lebenslauf als PDF exportieren können.

**Technologie-Vorschlag:** Next.js (App Router), TypeScript, React, eine State-Management-Lösung (z. B. Zustand oder React Context), eine PDF-Engine (z. B. `@react-pdf/renderer` oder `puppeteer` für HTML-zu-PDF), sowie **Supabase** als Backend-as-a-Service für Datenbank (Postgres), Auth und Bilder-Speicher (Storage).

**Hosting/Kostenmodell:** Die Anwendung ist für den privaten Gebrauch (Freundeskreis) gedacht, keine kommerzielle Nutzung. Damit lässt sich der komplette Stack kostenlos betreiben: Vercel Hobby-Plan (Hosting/Functions) + Supabase Free-Tier (DB/Auth/Storage).

---

## 2. Stakeholder

| Rolle | Interesse |
|---|---|
| Endnutzer (Bewerber) | Schnell und einfach einen professionellen Lebenslauf erstellen |
| Administrator | Templates verwalten, Nutzer verwalten |
| Entwickler | Wartbares, erweiterbares System |

---

## 3. Funktionale Anforderungen (Functional Requirements)

### 3.1 Benutzerverwaltung
- FR-1: Nutzer können sich registrieren (E-Mail/Passwort oder OAuth: Google, LinkedIn).
- FR-2: Nutzer können sich einloggen/ausloggen.
- FR-3: Passwort-Reset-Funktion.
- FR-4: Nutzerprofil verwalten (Name, E-Mail, Avatar).

### 3.2 Lebenslauf-Erstellung
- FR-5: Nutzer können ein neues Lebenslauf-Projekt anlegen.
- FR-6: Formularbasierte Eingabe folgender Sektionen:
  - Persönliche Daten (Name, Adresse, Kontakt, Foto, Titel/Position)
  - Berufserfahrung (Firma, Position, Zeitraum, Beschreibung, Ort)
  - Ausbildung (Institution, Abschluss, Zeitraum, Note)
  - Fähigkeiten/Skills (mit optionaler Bewertung/Level)
  - Sprachen (mit Niveau, z. B. CEFR A1–C2)
  - Zertifikate/Weiterbildungen
  - Projekte/Portfolio
  - Referenzen
  - Freitext-Abschnitt (z. B. Hobbys, über mich)
- FR-7: Sektionen können per Drag & Drop neu angeordnet werden.
- FR-8: Sektionen können ein-/ausgeblendet werden.
- FR-9: Mehrere Lebensläufe pro Nutzer möglich (z. B. für verschiedene Bewerbungen).
- FR-10: Autosave der Eingaben (Entwurf wird laufend gespeichert).

### 3.3 Templates & Design
- FR-11: Auswahl aus mehreren vorgefertigten Templates (z. B. klassisch, modern, kreativ, minimalistisch).
- FR-12: Live-Vorschau während der Bearbeitung (WYSIWYG).
- FR-13: Anpassung von Farbschema, Schriftart und Layout innerhalb eines Templates.
- FR-14: Responsive Vorschau (wie der Lebenslauf im Druck aussieht).

### 3.4 Export & Sharing
- FR-15: Export als PDF (druckfertig, A4/Letter).
- FR-16: Export als DOCX (optional, niedrigere Priorität).
- FR-17: Teilbarer Link zur Online-Ansicht des Lebenslaufs (optional).
- FR-18: Download-Historie / Versionen.

### 3.5 KI-Unterstützung (optional, aber gängig bei solchen Tools)
- FR-19: KI-gestützte Formulierungsvorschläge für Berufserfahrungstexte.
- FR-20: Rechtschreib-/Grammatikprüfung.
- FR-21: ATS-Check (Applicant-Tracking-System-Kompatibilitätsprüfung).

### 3.6 Administration
- FR-22: Admin-Dashboard zur Verwaltung von Templates.
- FR-23: Nutzerstatistiken (Anzahl erstellter Lebensläufe, aktive Nutzer).

---

## 4. Nicht-funktionale Anforderungen (Non-Functional Requirements)

| Kategorie | Anforderung |
|---|---|
| Performance | Ladezeit der Editor-Seite < 2s; PDF-Generierung < 5s |
| Skalierbarkeit | System soll mehrere tausend gleichzeitige Nutzer unterstützen |
| Sicherheit | HTTPS, Auth über Supabase (Passwörter serverseitig gehashed), Row-Level-Security-Policies in Supabase (Nutzer sehen nur eigene Daten/Dateien), CSRF-/XSS-Schutz, Rate-Limiting |
| Datenschutz | DSGVO-konform (Datenexport, Löschanfragen, Einwilligungen) |
| Verfügbarkeit | 99,5 % Uptime (bei Hosting z. B. Vercel) |
| Barrierefreiheit | WCAG 2.1 AA-konform (Formulareingaben, Kontraste, Screenreader) |
| Browser-Kompatibilität | Aktuelle Versionen von Chrome, Firefox, Safari, Edge |
| Mehrsprachigkeit | UI mindestens Deutsch/Englisch (i18n via next-intl o. Ä.) |
| Wartbarkeit | Modularer Code, Tests (Unit/Integration/E2E), CI/CD-Pipeline |
| SEO | Öffentliche Marketing-Seiten SEO-optimiert (SSR/SSG via Next.js) |

---

## 5. Technische Architektur

### 5.1 Frontend
- Next.js App Router (Server Components + Client Components je nach Bedarf)
- TypeScript für Typsicherheit
- Formularverwaltung: React Hook Form + Zod-Validierung
- State Management: Zustand oder Context API für Editor-State
- Styling: Tailwind CSS

### 5.2 Backend (Supabase als Backend-as-a-Service)
- Next.js API Routes / Route Handlers für Server-Logik (v. a. PDF-Generierung, KI-Anbindung)
- Datenbank: Supabase Postgres (Zugriff via `@supabase/supabase-js` bzw. `@supabase/ssr`; optional zusätzlich Prisma, das auf die Supabase-DB zeigt)
- Auth: Supabase Auth (E-Mail/Passwort, OAuth-Provider wie Google/LinkedIn)
- Datei-Storage: Supabase Storage für Profilbilder (Buckets mit Row-Level-Security, sodass jeder Nutzer nur eigene Dateien lesen/schreiben darf)
- PDF-Generierung: serverseitig via `@react-pdf/renderer` oder Puppeteer (HTML → PDF); fertige PDFs optional ebenfalls in Supabase Storage ablegen

### 5.3 Deployment
- Hosting: Vercel Hobby-Plan (kostenlos, für nicht-kommerzielle Projekte)
- CI/CD: GitHub Actions oder Vercels native Git-Integration
- Monitoring: Sentry für Fehler-Tracking (Free-Tier), Vercel Analytics für Nutzung
- Kostenrahmen: Vercel Hobby + Supabase Free-Tier (500 MB DB, 1 GB Storage, 50.000 MAU) – für einen Freundeskreis ausreichend

---

## 6. Datenmodell (vereinfacht)

```
User
 ├─ id, email, passwordHash, name, createdAt
 └─ Resumes[]

Resume
 ├─ id, userId, title, templateId, theme (JSON), createdAt, updatedAt
 ├─ PersonalInfo (1:1)
 ├─ Experiences[]
 ├─ Educations[]
 ├─ Skills[]
 ├─ Languages[]
 ├─ Certificates[]
 └─ Projects[]

Template
 ├─ id, name, previewImage, configSchema
```

---

## 7. Wichtige User Stories

1. Als Nutzer möchte ich mich registrieren, damit ich meine Lebensläufe speichern kann.
2. Als Nutzer möchte ich meine Berufserfahrung eintragen, damit sie im Lebenslauf erscheint.
3. Als Nutzer möchte ich zwischen Templates wechseln, ohne meine Daten neu eingeben zu müssen.
4. Als Nutzer möchte ich meinen Lebenslauf als PDF herunterladen, um ihn zu bewerben.
5. Als Nutzer möchte ich eine Live-Vorschau sehen, während ich Daten eingebe.
6. Als Admin möchte ich neue Templates hinzufügen können, ohne Code zu deployen (idealerweise über ein Template-Config-System).

---

## 8. Abgrenzung (Out of Scope, v1)

- Keine Team-/Kollaborationsfunktionen (mehrere Nutzer an einem Dokument)
- Kein Anschreiben-Generator (kann spätere Erweiterung sein)
- Keine native Mobile-App (nur responsive Web)

---

## 9. Akzeptanzkriterien (Beispiele)

- Ein Nutzer kann in unter 10 Minuten einen vollständigen Lebenslauf erstellen und als PDF exportieren.
- Die PDF-Ausgabe entspricht optisch zu 100 % der Live-Vorschau.
- Autosave verliert keine Eingaben bei Verbindungsabbruch (lokale Zwischenspeicherung als Fallback).

---

## 10. Nächste Schritte (Vorschlag)

1. Technischer Proof of Concept: Editor-Formular + eine Template + PDF-Export.
2. Datenbankschema mit Prisma finalisieren.
3. Auth-Flow implementieren.
4. Template-System (mind. 2–3 Templates) bauen.
5. Testing- und Deployment-Pipeline aufsetzen.
