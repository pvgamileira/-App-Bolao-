## 1. Deploy Pipeline Fixes

- [x] 1.1 Add `env` mapping block to the `npm run build` step in `.github/workflows/deploy.yml` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` secrets.

## 2. Graceful Initialization

- [x] 2.1 Refactor `src/lib/supabaseclient.ts` to not throw an error at the top level module scope when environment variables are missing.
- [x] 2.2 Update `src/App.tsx` or `src/main.tsx` to detect if the Supabase configuration is missing.
- [x] 2.3 Create a "Configuration Error" UI state that displays a clear error message (instead of a blank screen) when configuration is missing.
