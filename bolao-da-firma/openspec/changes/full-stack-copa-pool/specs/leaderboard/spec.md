## ADDED Requirements

### Requirement: Top 3 Podium
The system SHALL display a distinct top 3 podium visualization at the top of the leaderboard, using circular avatars with Gold, Silver, and Bronze accent borders.

#### Scenario: User views top 3
- **WHEN** the user navigates to the Leaderboard screen
- **THEN** they see the top 3 users highlighted in a podium format.

### Requirement: Ranking List
The system SHALL display a scrollable ranking list below the podium for the rest of the users. The currently logged-in user MUST be highlighted in green in this list.

#### Scenario: User finds their rank
- **WHEN** the user scrolls through the ranking list
- **THEN** they can easily identify their own position due to the green highlight.
