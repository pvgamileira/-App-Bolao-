## Why

The company needs a fun, frictionless World Cup Betting Pool application to engage employees. The app needs to provide easy login, daily match guessing, and a competitive leaderboard to encourage participation.

## What Changes

- Implement a frictionless login screen with a prominent "Enter Pool" CTA button.
- Create a daily matches view with a card layout, showing teams and score inputs, with a sticky "Save My Guesses" button.
- Build a leaderboard screen with a top 3 podium visualization and a scrollable ranking list.
- Implement the database schema in Supabase with `usuarios`, `jogos`, and `palpites` tables, including RLS policies for frictionless access.
- Develop the core business logic (`scoreCalculator.ts`) to calculate points based on exact match, goal difference, winner trend, and tie exceptions.
- Configure Tailwind CSS with the specified World Cup color palette (Dark Blue, Surface, Vibrant Green, Gold).

## Capabilities

### New Capabilities
- `auth`: Frictionless Login workflow and UI.
- `matches`: Daily matches display and guess submission.
- `leaderboard`: Leaderboard with top 3 podium and scrolling ranking list.
- `score-calculator`: Strict deterministic score calculation business logic.
- `database`: Supabase schema setup with users, matches, and guesses tables.

### Modified Capabilities

## Impact

- Adds new React components (`AuthForm`, `MatchGrid`, `LeaderboardPodium`).
- Updates `tailwind.config.ts` with new color tokens.
- Introduces Supabase database schema (`supabase_schema.sql`).
- Adds a new utility for score calculation (`src/utils/scoreCalculator.ts`).
