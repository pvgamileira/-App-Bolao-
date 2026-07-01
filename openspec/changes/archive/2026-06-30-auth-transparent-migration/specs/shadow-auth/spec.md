## ADDED Requirements

### Requirement: Database Shadow Account Initialization
The system SHALL create shadow accounts in `auth.users` for all legacy records in `public.usuarios` using the exact same UUID.

#### Scenario: Successful database migration
- **WHEN** the shadow auth migration SQL script is executed
- **THEN** every record in `public.usuarios` gets a corresponding record in `auth.users` with the same `id`
- **THEN** the dummy email is formed by appending `@bolaodafirma.app` to the normalized `nome_guerra` (no spaces, lowercase)
- **THEN** the encrypted password is set using the legacy PIN appended with `00`
- **THEN** it sets `aud` and `role` to `'authenticated'`, and populates `raw_app_meta_data` with email provider info
- **THEN** it inserts a corresponding row into `auth.identities` to enable email login capabilities

### Requirement: Transparent Login Synchronization
The frontend application SHALL silently authenticate the user with Supabase Auth (`auth.users`) when they log in using the legacy custom flow (Nome + PIN).

#### Scenario: User logs in successfully
- **WHEN** a user enters their Nome de Guerra and PIN in the legacy `AuthForm` and submits
- **THEN** the frontend constructs the dummy email and padded password
- **THEN** it executes `supabase.auth.signInWithPassword()`
- **THEN** the application stores the native Supabase session and proceeds to the dashboard

#### Scenario: User creates a new account
- **WHEN** a user enters a new Nome de Guerra and PIN in the `AuthForm` to create an account
- **THEN** the frontend signs them up natively via `supabase.auth.signUp()` using the constructed dummy credentials
- **THEN** it ensures a record is correctly linked or inserted into `public.usuarios` maintaining the legacy logic and UI flow
