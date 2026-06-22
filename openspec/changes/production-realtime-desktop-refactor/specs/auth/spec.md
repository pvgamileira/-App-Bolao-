## MODIFIED Requirements

### Requirement: Registration Tab
The `AuthForm.tsx` MUST feature distinct tabs for "[ Entrar ]" and "[ Criar Conta ]".
- In the "Criar Conta" tab, the user MUST provide `nome_guerra` and an optional 4-digit `pin`.
- Submission MUST perform a direct `INSERT` to the `public.usuarios` table.
- If the `nome_guerra` already exists (unique constraint violation), the UI MUST show an error.
