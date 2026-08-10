# Auth

CVio nutzt **Supabase Auth** (E-Mail + Passwort) für Registrierung, Login und
Session-Verwaltung. Es gibt keinen eigenen Nutzer-/Passwort-Speicher in der
App — Supabase übernimmt Hashing, Session-Tokens und Cookie-Refresh.

## Beteiligte Dateien

| Datei | Rolle |
|---|---|
| `app/lib/auth-actions.ts` | Server Actions `login`, `register`, `logout` |
| `app/(auth)/login/login-form.tsx`, `register-form.tsx` | Formulare, die die Actions über `useActionState` aufrufen |
| `app/lib/supabase/server.ts` | Supabase-Client für Server Components / Server Actions (liest Cookies aus `next/headers`) |
| `app/lib/supabase/client.ts` | Supabase-Client für Client Components (z. B. Foto-Upload) |
| `app/lib/supabase/update-session.ts` | Session-Refresh-Logik, aufgerufen aus `proxy.ts` |
| `proxy.ts` | Next.js Middleware — läuft vor jedem Request |
| `supabase/schema.sql` | RLS-Policies, die den Zugriff pro `auth.uid()` einschränken |

## Drei Supabase-Clients, drei Kontexte

Supabase-Sessions leben in Cookies. Je nachdem, *wo* im Next.js-Request-Zyklus
man sich befindet, braucht man einen anderen Client, weil der Zugriff auf
Cookies unterschiedlich funktioniert:

1. **`createClient()` aus `supabase/server.ts`** — für Server Components und
   Server Actions. Liest/schreibt Cookies über `next/headers`. Das
   `setAll`-Fehlerhandling (leerer `catch`) ist bewusst: Cookies können in
   Server Components während des Renderns nicht gesetzt werden — das ist
   unkritisch, weil `proxy.ts` die Session bei jedem Request ohnehin
   auffrischt.
2. **`createClient()` aus `supabase/client.ts`** — für Client Components
   (`"use client"`), z. B. `photo-upload.tsx`. Nutzt den Browser-Cookie-Store
   direkt.
3. **`createServerClient(...)` inline in `update-session.ts`** — für die
   Middleware. Liest Cookies aus dem `NextRequest`, schreibt sie sowohl auf
   den Request (für nachgelagerte Server Components im selben Durchlauf) als
   auch auf die `NextResponse` (damit der Browser sie erhält).

Alle drei zeigen auf dasselbe Supabase-Projekt (`NEXT_PUBLIC_SUPABASE_URL` +
`NEXT_PUBLIC_SUPABASE_ANON_KEY`), unterscheiden sich nur im Cookie-Transport.

## Middleware: Session-Refresh + Route-Schutz

`proxy.ts` matcht auf (fast) jeden Request (ausgenommen `_next/static`,
`_next/image`, Favicon, Bilddateien) und delegiert an `updateSession()`:

1. `supabase.auth.getUser()` validiert/erneuert den Session-Token. **Wichtig:**
   zwischen `createServerClient(...)` und `getUser()` darf keine weitere
   Logik stehen — sonst läuft Client- und Server-Session-State auseinander
   (Kommentar im Code weist explizit darauf hin).
2. Geschützte Routen (`/dashboard`, `/editor`) ohne eingeloggten Nutzer →
   Redirect nach `/login`.
3. Auth-Routen (`/login`, `/register`) mit bereits eingeloggtem Nutzer →
   Redirect nach `/dashboard`.
4. Sonst: `NextResponse.next()` mit aufgefrischten Cookies durchreichen.

Das ist die **einzige** Stelle, die Redirect-Logik für geschützte Routen
zentral durchsetzt. Einzelne Server Components (z. B. `resumes.ts` →
`requireUser()`) redirecten zusätzlich defensiv, falls sie doch ohne
Middleware-Schutz aufgerufen werden (z. B. aus einer Server Action heraus).

## Registrierung

`register()` in `auth-actions.ts`:

1. Validiert `name`, `email`, `password` mit `zod` (Passwort min. 8 Zeichen).
2. Ruft `supabase.auth.signUp(...)` auf, `full_name` landet in
   `user_metadata`.
3. **E-Mail-Bestätigung ist projektabhängig:** Ist sie im Supabase-Projekt
   aktiviert, liefert `signUp` *kein* aktives Session-Objekt zurück — der
   Code prüft `data.session` und leitet dann nach `/login?registered=1`
   statt `/dashboard` weiter.
4. Fehlerfälle werden auf verständliche deutsche Meldungen gemappt
   (`user_already_exists`, `over_email_send_rate_limit`); alles andere
   fällt auf eine generische Meldung zurück, um keine internen
   Supabase-Fehlercodes an den Nutzer durchzureichen.

## Login / Logout

- `login()` validiert nur minimal (E-Mail-Format, Passwort nicht leer) und
  überlässt die eigentliche Prüfung Supabase (`signInWithPassword`). Ein
  falsches Passwort und eine unbekannte E-Mail liefern absichtlich dieselbe
  Meldung ("E-Mail oder Passwort ist falsch"), um kein User-Enumeration zu
  ermöglichen.
- `logout()` ruft `supabase.auth.signOut()` und redirected nach `/login`.

## Autorisierung auf Datenebene: Row Level Security

Auth entscheidet nur, *wer eingeloggt ist* — welche Zeilen ein Nutzer sehen
darf, wird **nicht** in der App-Schicht geprüft, sondern durch Postgres RLS
in `supabase/schema.sql`:

```sql
using (auth.uid() = user_id)
```

auf `resumes`, `resume_match_usage` und den Storage-Objekten in
`resume-photos` (dort über den ersten Pfad-Bestandteil, siehe
`docs/api-request-flow.md`). Das bedeutet: Selbst ein Bug in der
Anwendungslogik (z. B. eine vergessene `.eq("user_id", ...)`-Klausel) kann
keine fremden Daten offenlegen — die Datenbank selbst verweigert den
Zugriff. Das ist der Grund, warum `app/lib/resumes.ts` trotzdem zusätzlich
nach `user_id` filtert: Defense in Depth, nicht der einzige Schutzwall.

## Was fehlt (bewusst)

Kein OAuth/Social-Login, keine Passwort-Reset-UI, keine Rollen/Admin-Rechte —
für ein privates Freundeskreis-Projekt (siehe `app/impressum/page.tsx`)
bewusst nicht gebaut.
