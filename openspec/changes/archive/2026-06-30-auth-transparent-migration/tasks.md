## 1. Database Migration

- [x] 1.1 Create a new SQL migration script (e.g., `20260630000000_shadow_auth_migration.sql`).
- [x] 1.2 Write a `DO $$` block to iterate over `public.usuarios`.
- [x] 1.3 For each user, construct `dummy_email` (e.g., lowercase `nome_guerra` without spaces + `@bolaodafirma.app`) and `encrypted_password` using `crypt(pin || '00', gen_salt('bf'))`. Note: Inserting directly into `auth.users` requires hashing the password with bcrypt, or using the Supabase Admin Auth API. If using SQL, use `pgcrypto` extension for `crypt`.
- [x] 1.4 Insert the record into `auth.users` setting `id`, `instance_id` (zero UUID), `aud` ('authenticated'), `role` ('authenticated'), `email`, `encrypted_password`, `email_confirmed_at` (now), and `raw_app_meta_data` (`{"provider":"email","providers":["email"]}`).
- [x] 1.5 Insert a corresponding record into `auth.identities` (provider: 'email', identity_data: `{"sub": "<uuid>", "email": "<dummy_email>"}`).
- [ ] 1.6 **MANUAL INSTRUCTION**: Prompt the user to go to their Supabase Dashboard -> Authentication -> Providers -> Email and turn **OFF** "Confirm email" so new users during the tournament aren't blocked by fake emails.

## 2. Frontend Auth Integration

- [x] 2.1 Update `src/components/AuthForm.tsx` to handle shadow auth logic.
- [x] 2.2 In the "ENTRAR" flow, call `supabase.auth.signInWithPassword()` using the dummy email and padded PIN before returning success.
- [x] 2.3 In the "CRIAR" flow, call `supabase.auth.signUp()` to create the native account first, then insert/update `public.usuarios`.
- [x] 2.4 Verify that the user session is successfully established in the Supabase client without affecting the user's visual flow.
