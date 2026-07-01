## Why

The current application lacks a cohesive and premium visual identity, which reduces user engagement and fails to deliver a modern SaaS experience. We need to overhaul the UI/UX with curated color palettes, sleek dark modes, glassmorphism, smooth gradients, and micro-animations to create a stunning first impression and a dynamic interface.

## What Changes

- Complete refactoring of the styling layer (CSS/Tailwind) across all components.
- Introduction of a cohesive design system and modern aesthetic principles (Web Application Development guidelines).
- Preservation of all existing React state, routing, Supabase integration, and business logic. No underlying functionality will be altered.

## Capabilities

### New Capabilities
- `frontend-aesthetics`: Defines the non-functional requirements for the new design system, aesthetic principles, and micro-animations.

### Modified Capabilities
- (None) No functional capabilities are being modified.

## Impact

- **Affected Code**: All React components in the `src/` directory (e.g., `App.tsx`, `MatchGrid.tsx`, `LeaderboardPodium.tsx`, etc.), and global CSS files (`index.css`).
- **Unaffected Code**: Edge functions, database schema, RLS policies, routing logic, and Supabase client calls remain strictly untouched.
