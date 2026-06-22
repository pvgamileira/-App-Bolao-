## 1. Supabase Client Fix
- [x] 1.1 In `src/lib/supabaseclient.ts`, assign `import.meta.env.VITE_SUPABASE_URL` to a variable and throw an error if it's missing.
- [x] 1.2 Do the same for `import.meta.env.VITE_SUPABASE_ANON_KEY`.
- [x] 1.3 Strip trailing slashes from the URL before calling `createClient`.

## 2. Auth Form Error Handling
- [x] 2.1 In `AuthForm.tsx`, when handling "Criar Conta" (`isLogin === false`), check if the Supabase error code is `23505`. If so, set the error to "Este nome de guerra já está em uso.".
- [x] 2.2 When handling "Entrar" (`isLogin === true`), ensure the query properly checks both `nome_guerra` and `pin` (if applicable). If `data` is empty or null, set the error to "Nome de guerra não encontrado ou PIN incorreto."
- [x] 2.3 Ensure any other database errors show a readable fallback message instead of crashing or showing a generic "Error".
