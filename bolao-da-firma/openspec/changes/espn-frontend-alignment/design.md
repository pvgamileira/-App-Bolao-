## Context

The edge function `sync-matches` now maps ESPN API statuses to `SCHEDULED`, `LIVE`, and `FINISHED`. The frontend must respect these mappings without second-guessing via client-side time checks, which historically caused bugs due to timezone conversions.

## Goals / Non-Goals

**Goals:**
- Completely rely on `match.status` for all UI locking and rendering logic.
- Remove any trace of client-side date checks that could prematurely lock fields.
- Display `EmptyState` when no rows are returned.

**Non-Goals:**
- Creating a new layout for `MatchGrid.tsx`.

## Decisions

- **Locking Restrictions:** Input fields `disabled` attribute will be strictly `match.status !== 'SCHEDULED'`.
- **Styling Changes:** If `status === 'LIVE'`, show a pulsating 'AO VIVO' badge. If `status === 'FINISHED'`, show the official score and a 'ENCERRADO' badge.
- **Query Alignment:** Ensure `App.tsx` fetches matches purely by `data_hora` ascending without strict date truncation.

## Risks / Trade-offs

- Relying solely on the database means that if the Edge Function fails to run, a match might stay 'SCHEDULED' even after it starts. However, this is a server-side concern; the client should remain thin and trust the database.
