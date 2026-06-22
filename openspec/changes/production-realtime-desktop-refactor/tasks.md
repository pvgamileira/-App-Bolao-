## 1. Authentication Updates (`AuthForm.tsx`)

- [x] 1.1 Implement tab switcher for "Entrar" and "Criar Conta".
- [x] 1.2 In the "Criar Conta" tab, add inputs for `nome_guerra` and `pin` (optional).
- [x] 1.3 Wire up the form submission to perform an `INSERT` into the `public.usuarios` table.
- [x] 1.4 Handle and display errors if the `nome_guerra` already exists (unique constraint).

## 2. Desktop Responsive Layout (`App.tsx`)

- [x] 2.1 Wrap the main container with a bounded max-width (e.g., `max-w-6xl mx-auto px-4`).
- [x] 2.2 Refactor the conditional rendering so that on desktop (`md:` breakpoint), the screen is split into a grid (e.g., `grid-cols-[1fr_350px]`).
- [x] 2.3 Render `MatchGrid` (or `AuthForm` if not logged in) on the left side, and `LeaderboardPodium` permanently on the right side for desktop views.

## 3. Strict Data Handling & Empty States

- [x] 3.1 Create `src/components/EmptyState.tsx` to standardize "no data" messages with Dark Blue containers and Primary Green styling.
- [x] 3.2 In `App.tsx` (or `MatchGrid`), remove `mockMatches` and initialize matches as `[]`. Fetch initial data from `public.jogos` and display the EmptyState if no matches exist.
- [x] 3.3 In `LeaderboardPodium.tsx`, remove `mockUsers`, initialize as `[]`. Display loading skeletons while fetching, and an EmptyState if no ranks exist.

## 4. Real-time Synchronization

- [x] 4.1 In `App.tsx` or a custom hook, set up a `supabase.channel('schema-db-changes')` subscription to `postgres_changes` on the `jogos` table.
- [x] 4.2 In the payload handler, update the local React state for `matches` to immediately reflect score or status changes.
- [x] 4.3 (Optional but recommended) Set up similar real-time subscriptions for `palpites` to update the leaderboard instantly.
