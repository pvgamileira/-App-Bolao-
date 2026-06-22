## Context

The initial application was built mobile-first with hardcoded mock arrays to prototype the UI quickly. As we move to production, we need a robust, scalable layout that utilizes desktop screen real estate efficiently, strict empty states to handle scenarios where data isn't present, explicit user registration, and real-time syncing via Supabase WebSockets to keep the UI fresh without manual reloads.

## Goals / Non-Goals

**Goals:**
- Desktop-optimized dashboard layout that splits the view into Main Content (Matches/Auth) and Sidebar (Leaderboard) on screens `md` (`768px`) and above.
- Zero mock data in production. All components must start with empty arrays or null states.
- Clean and explicit authentication flow in `AuthForm.tsx` (Sign in / Sign up tab split).
- Real-time updates using `supabase.channel` for the `jogos` table.

**Non-Goals:**
- Implementing a massive state management library (Redux/Zustand). We will keep it simple using React Context or lifting state in `App.tsx` and custom hooks for real-time logic.
- Complex user profiles or avatar uploads. We will stick to the basic `nome_guerra` registration.

## Decisions

- **Responsive Approach:** We will use Tailwind's `md:` prefixes to switch the main `App.tsx` layout from a single column (stacking elements or using bottom navigation) to a CSS Grid/Flex layout (`grid-cols-[2fr_1fr]` or flex row) where the Leaderboard is always visible on the right on desktop, while MatchGrid and Auth remain on the left.
- **Real-time Synchronization:** We'll leverage `useEffect` hooks in the top-level `App` or within specific components (like `MatchGrid`) to subscribe to `postgres_changes` on `public.jogos`. When an update event occurs, the local React state will be patched with the new payload.
- **Empty States:** A reusable `EmptyState.tsx` component will be created to render standardized "no data" messages across the application, adhering to the design system (Dark Blue containers, Primary Green accents).

## Risks / Trade-offs

- **[Risk] State Desync in Realtime:** Web-socket messages might arrive out of order or be missed if the connection drops.
  - *Mitigation:* Ensure we do a full fetch of current data on initial mount, and possibly implement a reconnection or polling fallback if Supabase channels disconnect.
- **[Risk] Desktop Layout Over-stretching:** Wide monitors can stretch inputs and cards uncomfortably.
  - *Mitigation:* The main container will be clamped using `max-w-6xl mx-auto px-4`.
