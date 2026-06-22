## Context

We are building a World Cup Betting Pool application to engage employees. The app will feature frictionless login (just a username "nome_guerra" and optional PIN), daily matches to guess on, and a leaderboard. It will be built as a full-stack application using React, Tailwind CSS, and Supabase for the backend.

## Goals / Non-Goals

**Goals:**
- Provide a frictionless, password-less (or simple PIN) login experience.
- Implement an attractive, dynamic UI with a World Cup theme (Dark Blue, Surface, Vibrant Green, Gold).
- Accurately calculate scores using a strict set of rules (Exact Match, Goal Difference, Winner Trend, Tie Exceptions).
- Real-time or easy access to the leaderboard and match data.

**Non-Goals:**
- Complex authentication (OAuth, Email verification).
- Payment or real money integrations.
- Admin dashboard for adding matches (matches will be seeded directly in DB for this scope).

## Decisions

- **Framework**: React with Tailwind CSS for rapid UI development and styling control.
- **Backend**: Supabase (PostgreSQL). It provides built-in Row Level Security (RLS) which is perfect for our frictionless login (allowing anonymous inserts/reads where appropriate).
- **Styling**: Tailwind CSS with custom tokens for the World Cup palette.
- **State Management**: React Context or local state, since the app is relatively simple (Auth state, Matches, Leaderboard).

## Risks / Trade-offs

- [Risk] Frictionless login might lead to impersonation.
  - Mitigation: The use of an optional PIN provides basic security. This is an internal company app, so trust is higher.
- [Risk] Score calculation logic errors.
  - Mitigation: We will extract the scoring logic into a pure, deterministic utility function `scoreCalculator.ts` which can be heavily unit tested.
