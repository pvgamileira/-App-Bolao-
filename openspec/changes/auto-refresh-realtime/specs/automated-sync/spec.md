## ADDED Requirements

### Requirement: Automated Background Sync via Cron
The system SHALL fetch live data from ESPN periodically using a database-level cron job without relying on frontend initialization.

#### Scenario: Periodic match synchronization
- **WHEN** the scheduled `pg_cron` job triggers (e.g., every 1 minute)
- **THEN** the Supabase PostgreSQL instance uses `pg_net` to HTTP POST to the `sync-matches` Edge Function
- **AND** passes the correct Authorization Bearer token stored securely in the Vault

#### Scenario: Cleanup of legacy manual sync
- **WHEN** the user opens the frontend application
- **THEN** the React app SHALL NOT manually invoke `supabase.functions.invoke('sync-matches')`
- **AND** the app relies strictly on the incoming WebSocket stream from the automated sync
