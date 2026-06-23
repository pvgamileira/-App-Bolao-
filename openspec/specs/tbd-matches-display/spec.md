## ADDED Requirements

### Requirement: Bloqueio de palpites para times indefinidos
The system SHALL identify matches where the teams are not yet defined (e.g. "Group A 2nd Place", "Group B Winner") and SHALL disable the inputs to prevent guesses, displaying "Seleção não definida" instead of the team's logo.

#### Scenario: Upcoming match with unknown teams
- **WHEN** the `MatchGrid` renders a match with a team name containing generic terms like "Group", "Winner" or "Place"
- **THEN** the inputs for the guess are disabled and greyed out
- **THEN** the team flag/logo area displays a generic "A Definir" style indicator
