## Context

The application currently lacks a visible version indicator. This makes it difficult for users and developers to know which release is currently running in production. To resolve this, a simple approach reading an environment variable `VITE_APP_VERSION` will be implemented.

## Goals / Non-Goals

**Goals:**
- Provide a visible version tag in the UI (AuthForm and Layout).
- Use `VITE_APP_VERSION` from `.env.local` or environment variables injected at build time.
- Maintain strict TypeScript typings, with no TS/syntax errors to ensure Vercel deployments pass.

**Non-Goals:**
- Automate version increment logic (e.g., via GitHub Actions). This design only sets up the UI and environment variable.

## Decisions

- **Using `VITE_APP_VERSION`**: Vite exposes variables prefixed with `VITE_` to the client app via `import.meta.env`. Using `VITE_APP_VERSION` is the standard Vite approach.
- **Strict Typings**: We will ensure `import.meta.env.VITE_APP_VERSION` is properly typed as a string or undefined. The fallback will be provided (e.g., `'v1.0.0'`) if the variable is not set.

## Risks / Trade-offs

- **[Risk] Vercel deploy failure due to TS typing on `import.meta.env`** → We will use it safely and if necessary, declare `VITE_APP_VERSION: string` in `vite-env.d.ts` so the build does not fail.
