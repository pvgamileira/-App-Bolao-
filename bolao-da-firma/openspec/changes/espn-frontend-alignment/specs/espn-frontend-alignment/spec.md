## ADDED Requirements

### Requirement: Server-Driven Interactivity
The interactive state of the prediction inputs SHALL be determined solely by the database `status` column.

#### Scenario: Match is SCHEDULED
- **WHEN** the match `status` is `SCHEDULED`
- **THEN** inputs and buttons MUST be enabled, regardless of the user's local clock.

#### Scenario: Match is LIVE or FINISHED
- **WHEN** the match `status` is `LIVE` or `FINISHED`
- **THEN** inputs MUST be disabled and appropriate visual badges displayed.

### Requirement: Clean Empty State
The system SHALL cleanly handle an empty dataset.

#### Scenario: No matches available
- **WHEN** the data fetch returns 0 rows
- **THEN** the `<EmptyState />` component is displayed without any hardcoded fallback data.
