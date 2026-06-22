## Why

The application is failing to deploy correctly to GitHub Pages. Additionally, when the deployment occasionally succeeds, the application shows a blank screen with just the primary color background. 
The root cause for the blank screen is that Vite relies on environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) which are currently missing during the build phase in the GitHub Actions workflow. Because these are missing, the Supabase client throws an error immediately on load, causing the React application to crash before anything is rendered. 
We need to fix the deployment pipeline and also add more graceful error handling so the app doesn't just show a blank screen if configuration is missing.

## What Changes

- Add environment variables mapping to the `npm run build` step inside `.github/workflows/deploy.yml` so that GitHub Secrets are baked into the Vite build.
- Update `src/lib/supabaseclient.ts` to handle missing environment variables without crashing the main module load.
- Show a user-friendly error message on the screen if Supabase credentials are missing, preventing the silent blank screen issue.

## Capabilities

### New Capabilities

- `deploy-pipeline`: Fix the GitHub Actions deployment workflow to inject required secrets at build time.
- `graceful-initialization`: Ensure the application displays a friendly fallback or error state instead of a blank screen when critical configuration variables are missing.

### Modified Capabilities

None

## Impact

- `.github/workflows/deploy.yml` (Adding environment variables during the build step)
- `src/lib/supabaseclient.ts` (Better handling of missing variables)
- `src/App.tsx` / `src/main.tsx` (Graceful handling of initialization errors)
