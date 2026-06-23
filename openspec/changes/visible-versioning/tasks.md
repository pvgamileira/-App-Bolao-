## 1. Environment Setup

- [x] 1.1 Add `VITE_APP_VERSION` to `.env.local` (and `.env.example` if applicable) with an initial value of `v1.0.0`
- [x] 1.2 Update `vite-env.d.ts` (if exists) or ensure safe typing for `import.meta.env.VITE_APP_VERSION` to prevent TS errors

## 2. UI Updates

- [x] 2.1 Update `src/components/AuthForm.tsx` to safely display `import.meta.env.VITE_APP_VERSION` below the app title
- [x] 2.2 Update `src/components/Layout.tsx` to safely display `import.meta.env.VITE_APP_VERSION` in the header or footer alongside the app name
