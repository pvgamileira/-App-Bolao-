## ADDED Requirements

### Requirement: Historic Match Sync (Start of Tournament)
The system SHALL configure the `sync-matches` Edge Function to fetch matches starting from the beginning of the 2026 World Cup (2026-06-11) instead of the current day, ensuring all past matches and their scores are accurately synced and maintained in the `jogos` table alongside future matches.

#### Scenario: Syncing past games
- **WHEN** the `sync-matches` Edge Function is executed
- **THEN** it fetches all matches starting from `2026-06-11` up to 14 days ahead of the current date
- **THEN** it upserts these matches into the Supabase database

## ADDED Requirements

### Requirement: HMR Singleton React Root
The frontend application SHALL guarantee that the React root is instantiated as a singleton during hot-module replacements (HMR) to prevent the DOM from being duplicated across hot reloads.

#### Scenario: Hot reload occurs
- **WHEN** Vite triggers a module update for `main.tsx` or its descendants
- **THEN** the application verifies if a root container is already present in memory
- **THEN** it re-renders the application without appending a second root instance
