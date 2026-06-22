## Context

The Supabase client throws "Invalid path specified in request URL" when `VITE_SUPABASE_URL` is undefined or malformed (like having a trailing slash). We need to prevent the app from attempting to run in an invalid state by throwing clear errors early.
Also, `AuthForm` currently might have rough edges regarding error messages when a user hits database constraints like "Nickname already exists" or entering a wrong PIN.

## Goals / Non-Goals

**Goals:**
- Enforce strict environment variable presence checks in `src/lib/supabaseclient.ts`.
- Clean the Supabase URL to avoid path resolution bugs.
- Enhance `AuthForm.tsx` to display human-readable error messages for Postgres constraint violations (e.g. error code `23505` for unique violations).

**Non-Goals:**
- We are not rewriting the auth flow to use Supabase Auth (we are using a custom `usuarios` table, so we stick to that).
- We are not adding complex password hashing; the PIN is stored as plaintext per the existing schema for simplicity.

## Decisions

- **Client Validation**: We'll add explicit `if (!url) throw new Error(...)` checks right where `createClient` is called. This fails fast before React mounts properly, making it obvious what's broken to developers.
- **Error Handling**: In `AuthForm.tsx`, when `supabase.from('usuarios').insert()` fails with `23505` (unique_violation), we will set a specific error: "Este nome de guerra já está em uso.". If login fails (no rows returned or wrong PIN), we will show: "Nome de guerra não encontrado ou PIN incorreto."

## Risks / Trade-offs
- **Fail-fast on client**: Throwing an error at the module level in `supabaseclient.ts` will crash the React tree. This is intentional for developer experience, but if someone loads the production app without env vars, they get a blank page or white screen of death.
  - *Mitigation*: We should only see this during setup. Vercel/Netlify will be configured with proper env vars.
