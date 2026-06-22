## Why

The database table `public.usuarios` was pre-populated with names in fully uppercase text. However, users logging in via the `AuthForm` often type their names in title case or lower case (e.g., "John" instead of "JOHN"), causing the `.eq('nome_guerra', ...)` query to fail and display an "Usuário não encontrado" error, blocking them from using the application.

## What Changes

- Introduce a normalization step inside `handleSubmit` of `src/components/AuthForm.tsx`.
- Any typed name will be transformed using `.trim().toUpperCase()` before it hits the Supabase queries.
- Both the `CRIAR` (account registration/pin setting) and `ENTRAR` (login) blocks will use this normalized variable.

## Capabilities

### New Capabilities
- `case-insensitive-auth-normalization`: Normalizes names to uppercase client-side to ensure seamless login against pre-populated records.

### Modified Capabilities

## Impact

- `src/components/AuthForm.tsx` (Login payload formatting)
