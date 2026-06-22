## Why

The `npm run build` process is failing due to 7 TypeScript compiler errors. These errors are caused by unused variables, unused imports, and the enforcement of `verbatimModuleSyntax` which requires explicit type-only imports for types. Fixing these errors is necessary to allow the project to build successfully and ensure code quality and strict type safety.

## What Changes

- Remove unused `payload` parameters from Supabase real-time channel subscriptions in `src/App.tsx`.
- Remove the unused `nomeGuerra` parameter from the `handleLogin` function signature in `src/App.tsx` (or prefix it with an underscore `_nomeGuerra` if required by other signatures).
- Change the `ReactNode` import in `src/components/Layout.tsx` to a type-only import (`import type { ReactNode } from 'react';`) to satisfy `verbatimModuleSyntax`.
- Remove unused `Trophy` and `Moon` icon imports from `src/components/LeaderboardPodium.tsx`.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
None. (This is a refactoring/code-quality change that does not alter product requirements).

## Impact

- **Affected code:**
  - `src/App.tsx`
  - `src/components/Layout.tsx`
  - `src/components/LeaderboardPodium.tsx`
- **Impact:** The build pipeline will succeed. There are no runtime or behavioral changes to the application.
