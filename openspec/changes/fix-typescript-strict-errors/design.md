## Context

The `npm run build` process is failing due to 7 TypeScript compiler errors related to strict mode (`verbatimModuleSyntax` and `noUnusedLocals`/`noUnusedParameters`). We need to clean up unused variables, imports, and enforce type-only imports to satisfy the compiler.

## Goals / Non-Goals

**Goals:**
- Fix all 7 TypeScript errors reported during build.
- Ensure the application builds successfully without suppressing errors via `// @ts-ignore`.

**Non-Goals:**
- No refactoring of business logic or functional changes.
- No changes to component structure or design.

## Decisions

- **Remove Unused Variables**: Variables like `payload` in real-time subscriptions, `nomeGuerra` in login, and `Trophy`/`Moon` icons will be safely removed or prefixed with `_` if they must remain in the signature.
- **Type-Only Imports**: The `ReactNode` import will be converted to `import type { ReactNode } from 'react';` to explicitly satisfy `verbatimModuleSyntax`.

## Risks / Trade-offs

- **Risk**: Removing a variable that was intended to be used.
- **Mitigation**: Based on the context provided, `payload` in real-time callbacks and the icons are genuinely unused. We will review `nomeGuerra` carefully, but prefixing it with an underscore `_nomeGuerra` mitigates the compiler error while preserving the signature if needed for interface compliance.
