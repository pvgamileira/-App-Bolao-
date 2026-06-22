## Context

The React application uses Vite and is hosted on GitHub Pages. It relies on Supabase for its backend, which requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. Currently, the `.github/workflows/deploy.yml` does not inject these variables during the `npm run build` step, leading to the app being built with `undefined` values for the variables. The Supabase client throws an error on initialization if these variables are missing, which crashes the React app immediately before it can render anything, resulting in a blank screen.

## Goals / Non-Goals

**Goals:**
- Fix the GitHub Actions deploy workflow so the required environment variables are passed to Vite during the build.
- Implement a fallback UI or error boundary for missing configuration instead of a blank screen.

**Non-Goals:**
- We will not migrate away from Supabase or Vite.
- We will not change how routing works.

## Decisions

- **Environment Variable Injection:** We will map the GitHub repository secrets directly in the `env` block of the `npm run build` step in `deploy.yml`. This is the standard Vite approach for injecting variables at build time.
- **Graceful Error Handling:** We will modify `src/lib/supabaseclient.ts` or `src/main.tsx` so that if variables are missing, the application catches the error and displays a clear "Configuration Error" message to the user instead of a blank screen.

## Risks / Trade-offs

- [Risk] Secrets are not configured in the GitHub repository. -> Mitigation: The new graceful error handling will show a clear message to the developer/user telling them exactly what is missing, rather than failing silently.
