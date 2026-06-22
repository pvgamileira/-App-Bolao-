## ADDED Requirements

### Requirement: Strict Routing
The system SHALL ensure that the dashboard and leaderboard pages are completely isolated through explicit routing.

#### Scenario: Navigating to Dashboard
- **WHEN** the user visits `/dashboard`
- **THEN** only the `MatchGrid` is rendered inside the `Layout` shell.

#### Scenario: Navigating to Leaderboard
- **WHEN** the user visits `/leaderboard`
- **THEN** only the `LeaderboardPodium` is rendered inside the `Layout` shell.

### Requirement: Match Grid Querying
The `MatchGrid` data fetching logic SHALL query matches based on their state rather than strict dates.

#### Scenario: Fetching active matches
- **WHEN** the app loads the dashboard
- **THEN** it fetches up to 15 matches with status IN ('SCHEDULED', 'LIVE', 'FINISHED') ordered by `data_hora` ascending.

### Requirement: Match Grid Interactive State
The `MatchGrid` inputs SHALL strictly be tied to the match `status`.

#### Scenario: Match is scheduled
- **WHEN** `status` is `SCHEDULED`
- **THEN** inputs are enabled and the user can change and save them.

#### Scenario: Match is live
- **WHEN** `status` is `LIVE`
- **THEN** inputs are completely disabled and a pulsating "LIVE" badge is displayed.

#### Scenario: Match is finished
- **WHEN** `status` is `FINISHED`
- **THEN** inputs are completely disabled and a "FINAL" badge is displayed.

#### Scenario: No matches
- **WHEN** the fetch returns an empty list
- **THEN** the text "Aguardando sincronização da API ou nenhum jogo próximo." is shown.

### Requirement: API Competition Filter
The Edge Function SHALL strictly query the World Cup competition endpoint.

#### Scenario: Executing sync
- **WHEN** the edge function `sync-live-matches` runs
- **THEN** it targets `https://api.football-data.org/v4/competitions/WC/matches`.
