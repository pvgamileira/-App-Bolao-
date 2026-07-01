## Context

The Bolão da Firma app uses a custom authentication system (`public.usuarios`), identifying users via a "Nome de Guerra" and a PIN. Because Supabase Auth (`auth.users`) is completely empty, native Row Level Security (RLS) policies relying on `auth.uid()` fail, making the application inherently insecure. We need to bootstrap `auth.users` with the exact existing UUIDs and start issuing real JWT tokens to the frontend so RLS can function without refactoring the custom login screen.

## Goals / Non-Goals

**Goals:**
- Inject legacy `public.usuarios` rows into `auth.users` with matching UUIDs.
- Generate dummy emails (`<nome_guerra>@bolaodafirma.app`) and passwords (`<PIN>00`).
- Update the React frontend (`AuthForm.tsx`) to log into Supabase natively when a user inputs their legacy credentials.
- Retain the exact same user experience (zero visual or flow changes).

**Non-Goals:**
- Implementing standard industry auth features (like Magic Links, Password Reset, OAuth). This is a technical debt item for post-tournament.
- Replacing the `public.usuarios` table completely. It will remain as a "Profile" table.

## Decisions

### 1. Forced UUID Insertion
**Decisão:** The SQL migration script will manually insert rows into `auth.users` specifying the `id` field directly from `public.usuarios.id`.
**Rationale:** Supabase allows inserting UUIDs explicitly in the `auth.users` table. Doing this maintains existing referential integrity. If we let Supabase generate new UUIDs, we would have to cascade update all child tables (bets, leagues, members), which is risky during an active event.

### 2. Password Padding
**Decisão:** The 4-digit PIN will be padded with "00" to meet Supabase's minimum 6-character password requirement.
**Rationale:** It's the simplest transformation that doesn't require storing a new plaintext mapping anywhere or asking the user to update their PIN.

## Risks / Trade-offs

- **Risk:** New users signing up might input names with special characters or spaces that are invalid for dummy emails.
  - **Mitigation:** The frontend already normalizes the "Nome de Guerra" (trimming, uppercase). We will further sanitize it for the dummy email creation by removing spaces or special characters.
- **Risk:** Storing dummy emails in `auth.users`.
  - **Mitigation:** Safe short-term tradeoff. Post-tournament, these dummy records can be deleted or transitioned when we implement a proper auth flow.
