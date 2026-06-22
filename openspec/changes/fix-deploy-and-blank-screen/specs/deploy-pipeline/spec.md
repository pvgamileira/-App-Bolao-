## ADDED Requirements

### Requirement: Inject environment secrets during build
The deployment pipeline SHALL inject `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables during the application build step.

#### Scenario: Successful production build
- **WHEN** the GitHub action runs the build step
- **THEN** Vite resolves the `import.meta.env` references to the actual secret values instead of `undefined`
