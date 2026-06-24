## ADDED Requirements

### Requirement: Legacy points reconciliation script
The system SHALL provide a local Node.js script (`scripts/sync_legacy_points.cjs`) that reconciles the `pontos_legado` column in the `usuarios` table against hardcoded PDF target values, scoped to a cutoff date.

#### Scenario: Script calculates and sets pontos_legado for each user
- **WHEN** the script is executed via `node scripts/sync_legacy_points.cjs`
- **THEN** it SHALL fetch all users from the `usuarios` table
- **THEN** it SHALL fetch all `palpites` joined with `jogos` where `jogos.data_hora` is on or before `2026-06-22T23:59:59Z`
- **THEN** for each user with a PDF target (Enos: 94, Gabriel: 106, Jairo: 90, Paulo: 92, Thyago: 104), it SHALL calculate `pontos_legado = PDF_target - sum(pontos_ganhos for pre-cutoff matches)`
- **THEN** it SHALL update the `pontos_legado` column in `usuarios` for each user with the calculated value

#### Scenario: Script uses native fetch API
- **WHEN** the script communicates with Supabase
- **THEN** it SHALL use the native Node.js `fetch` API against the Supabase REST endpoint (`/rest/v1/`)
- **THEN** it SHALL NOT import or use `@supabase/supabase-js`

#### Scenario: Script is idempotent
- **WHEN** the script is executed multiple times in succession
- **THEN** the resulting `pontos_legado` values SHALL be identical each time

#### Scenario: Script warns on negative legacy
- **WHEN** the calculated `pontos_legado` for a user is negative
- **THEN** the script SHALL log a warning indicating the PDF target is lower than the sum of auto-calculated points
- **THEN** the script SHALL still apply the negative value

### Requirement: Frontend leaderboard includes legacy points
The frontend leaderboard calculation SHALL sum both `pontos_legado` and `pontos_ganhos` to produce each user's total score.

#### Scenario: Leaderboard displays correct total
- **WHEN** the leaderboard is rendered in the app
- **THEN** each user's displayed points SHALL equal `pontos_legado + sum(pontos_ganhos)` from the database
- **THEN** the leaderboard SHALL be sorted by this total in descending order
