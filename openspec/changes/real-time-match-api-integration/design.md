## Context

The system currently synchronizes matches from the ESPN API but does not persist the exact live elapsed time (`displayClock`) into the database. Furthermore, on the frontend, users can still input scores while a match is live, which should be restricted.

## Goals / Non-Goals

**Goals:**
- Create a migration to add `tempo_decorrido` to the `jogos` table.
- Update the Edge Function `sync-matches/index.ts` to capture and store `displayClock`.
- Update frontend interfaces (e.g., `Match` type) to type `tempoDecorrido` properly (no TS errors).
- Update the UI to lock inputs and show the official score when the match is `LIVE`.

**Non-Goals:**
- Adding a real-time WebSocket connection from ESPN. We will rely on the existing sync mechanism (e.g., cron or manual trigger).

## Decisions

- **Database Column**: Use `text` (VARCHAR) for `tempo_decorrido` in Postgres since ESPN provides strings like `"45'"`, `"HT"`, `"90+2'"`.
- **Frontend State Management**: The `Match` type in `MatchGrid.tsx` and the mapping inside `App.tsx` will be updated so that `match.tempoDecorrido` is available without TS errors.
- **UI Logic**: When `match.status === 'LIVE'`, the inputs will be rendered exactly as they are when `match.status === 'FINISHED'` (readonly showing `placarOficialA`/`B`).

## Risks / Trade-offs

- **[Risk] TypeScript errors during build** → We will ensure that the type `Match` and `MatchData` (from Supabase response) include `tempo_decorrido: string | null` and map it appropriately.
