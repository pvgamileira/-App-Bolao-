## Context

The current `App.tsx` layout renders both Dashboard and Leaderboard simultaneously on some resolutions or fails to isolate their routes correctly. The `MatchGrid` component queries based on strict current date, which creates edge cases with UTC vs Local time. The Edge Function `sync-live-matches` calls a generic `/matches` endpoint, which is insufficient for football-data.org if you only want World Cup matches (requires `competitions/WC/matches`). 

## Goals / Non-Goals

**Goals:**
- Guarantee strict route isolation for `/`, `/dashboard`, and `/leaderboard`.
- Query `public.jogos` by status (`SCHEDULED`, `LIVE`, `FINISHED`) limiting to 15 rather than strict today filtering.
- Make the Edge function strictly query the `WC` competition.

**Non-Goals:**
- Completely rewriting the MatchGrid or Leaderboard visual styles.
- Creating new tables in the database.

## Decisions

- **React Router `Routes` Layout:** Replace the current layout-based condition in `App.tsx` with strict `<Routes>` elements. `<Layout>` will be used purely as a shell wrapper around the specific page components.
- **Match Query Logic:** Instead of relying on `now()::date`, we rely on `status IN ('SCHEDULED', 'LIVE', 'FINISHED')` ordered by `data_hora ASC`. This ensures we show the most relevant upcoming/live matches regardless of timezone shifts.
- **Edge Function API URL:** Update `fetch` URL to `https://api.football-data.org/v4/competitions/WC/matches`.

## Risks / Trade-offs

- **Risk:** Edge function might not return matches if the World Cup competition is inactive on the API side.
  - *Mitigation:* Ensure we catch and properly log errors, and provide a fallback or empty state ("Aguardando sincronização da API ou nenhum jogo próximo.") on the frontend.
