## MODIFIED Requirements

### Requirement: Defensive Client Initialization
The `src/lib/supabaseclient.ts` MUST validate environment variables before initializing the Supabase client.
- It MUST read `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `import.meta.env`.
- If either is missing or undefined, it MUST `throw new Error` with a clear message instructing the developer to check their `.env.local` file.
- It MUST strip any trailing slashes from the `VITE_SUPABASE_URL` before passing it to `createClient`.
