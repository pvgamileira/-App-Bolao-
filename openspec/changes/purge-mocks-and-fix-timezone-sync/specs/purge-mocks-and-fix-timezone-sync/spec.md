## ADDED Requirements

### Requirement: No Mock Data
The frontend SHALL NOT use any hardcoded match data.

#### Scenario: Database is empty
- **WHEN** `public.jogos` returns 0 rows
- **THEN** the `<EmptyState />` component is rendered with no matches shown.

### Requirement: Resilient Date Filtering
Matches SHALL be filtered and displayed without being dropped by UTC offsets.

#### Scenario: Match occurs late in the day
- **WHEN** a match is scheduled for 21:00 UTC-3 (which is next day UTC)
- **THEN** the query logic ensures it is fetched and displayed correctly for the local calendar day.

### Requirement: Accurate Prediction Binding
User inputs SHALL bind accurately to the `palpites` records.

#### Scenario: Saving predictions
- **WHEN** the user inputs scores and clicks "Salvar"
- **THEN** the system calls an upsert on `public.palpites` enforcing the `usuario_id, jogo_id` constraint.
