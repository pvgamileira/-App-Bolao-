## Why

Users need to easily see which version of the application is currently running in production to track updates and newly released features from the roadmap. Currently, there is no visible app version tag in the UI.

## What Changes

- Add a dynamic version tag (e.g., `v1.0.1`) that reads from an environment variable (`VITE_APP_VERSION`).
- Display this tag on the Login/Registration screen (`AuthForm`).
- Display this tag in the application footer or header (`Layout`).
- Update `.env.local` and `.env.example` with the new environment variable.

## Capabilities

### New Capabilities
- `visible-versioning`: Display of the application version in the UI.

### Modified Capabilities


## Impact

- `src/components/Layout.tsx`
- `src/components/AuthForm.tsx`
- Environment files (`.env.local`, `.env.example`)
