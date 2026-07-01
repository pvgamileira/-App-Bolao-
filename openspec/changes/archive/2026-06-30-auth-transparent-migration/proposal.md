## Why

To enable Supabase Row Level Security (RLS) properly, users must be authenticated via Supabase's native `auth.users` system. Currently, the app relies entirely on a custom authentication flow using the `public.usuarios` table (with "Nome de Guerra" and PIN) and does not interact with Supabase Auth. To enforce security without forcing a complete rewrite of the frontend during an active tournament, we need a short-term "Shadow Auth" (Transparent Login) system that synchronizes the legacy `public.usuarios` records with `auth.users` seamlessly.

## What Changes

- Create a SQL migration script to loop through existing `public.usuarios` records and forcefully insert them into `auth.users`.
- Map the legacy PIN to a padded 6-character password (e.g., PIN + "00") and the "Nome de Guerra" to a dummy email (`nome_guerra@bolaodafirma.app`).
- Preserve the exact UUID from `public.usuarios` when creating the `auth.users` record to maintain referential integrity.
- Update `AuthForm.tsx` to automatically and silently call `supabase.auth.signInWithPassword()` using the dummy credentials generated from the user's input.

## Capabilities

### New Capabilities
- `shadow-auth`: A synchronization capability that generates dummy Supabase Auth credentials from custom legacy inputs (Nome + PIN) and logs the user into the native Supabase session seamlessly.

### Modified Capabilities

## Impact

- **Database**: `auth.users` will be populated with shadow accounts.
- **Frontend**: `AuthForm.tsx` will now issue native Supabase authentication calls alongside its usual custom logic.
- **Security**: The application will start storing secure JWT tokens, unlocking the ability to use robust Row Level Security (RLS) based on `auth.uid()`.
