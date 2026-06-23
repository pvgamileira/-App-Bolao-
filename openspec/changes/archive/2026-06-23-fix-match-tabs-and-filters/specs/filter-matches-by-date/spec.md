## ADDED Requirements

### Requirement: Custom Date Range Filtering
The system SHALL allow users to select a start date and an end date to filter matches displayed in the 'Todos os Jogos' tab.

#### Scenario: User selects a valid date range
- **WHEN** the user selects a Start Date and an End Date
- **THEN** the grid displays only matches whose start dates fall within the selected boundaries (inclusive).

#### Scenario: User leaves both dates empty
- **WHEN** the user clears both the Start Date and End Date inputs
- **THEN** the grid displays all available matches without any date restrictions.

#### Scenario: User selects only start date
- **WHEN** the user sets a Start Date but leaves End Date empty
- **THEN** the grid displays all matches occurring on or after the Start Date.

#### Scenario: User selects only end date
- **WHEN** the user sets an End Date but leaves Start Date empty
- **THEN** the grid displays all matches occurring on or before the End Date.
