## ADDED Requirements

### Requirement: Dynamic "Today" Resolution
The system SHALL dynamically resolve "Jogos de Hoje" by comparing match dates against the user's real-time local date (e.g., `new Date()`).

#### Scenario: Match occurs on the current calendar day
- **WHEN** a match's start date is between 00:00:00 and 23:59:59 of the user's current local date
- **THEN** the match is displayed in the "Jogos de Hoje" tab.

#### Scenario: Match occurs outside the current calendar day
- **WHEN** a match's start date is before 00:00:00 or after 23:59:59 of the user's current local date
- **THEN** the match is NOT displayed in the "Jogos de Hoje" tab.

### Requirement: Match Grid Tab Renaming
The system SHALL rename the secondary tab from "Jogos Futuros" to "Todos os Jogos".

#### Scenario: User views the tabs
- **WHEN** the match grid renders the tab selection
- **THEN** the tabs displayed are "Jogos de Hoje" and "Todos os Jogos".
