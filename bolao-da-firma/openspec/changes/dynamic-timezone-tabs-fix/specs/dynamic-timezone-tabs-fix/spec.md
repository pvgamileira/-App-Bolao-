## ADDED Requirements

### Requirement: Dynamic Date Filtering
The system SHALL filter matches using a dynamically generated snapshot of the current date rather than hardcoded constants.

#### Scenario: User navigates to Today's Tab
- **WHEN** 'Jogos de Hoje' is active
- **THEN** it renders only matches whose date string starts with `new Date().toISOString().split('T')[0]`.

#### Scenario: User navigates to Future Tab
- **WHEN** 'Jogos Futuros' is active
- **THEN** it renders only matches strictly occurring after midnight of the calculated current date.
