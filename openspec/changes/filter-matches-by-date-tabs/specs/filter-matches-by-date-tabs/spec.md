## ADDED Requirements

### Requirement: Tab Navigation
The system SHALL display two tabs to navigate between current and future matches.

#### Scenario: User clicks 'Jogos Futuros'
- **WHEN** the user is viewing the dashboard
- **THEN** they can click the 'Jogos Futuros' tab, which updates the view to show matches beyond 2026-06-22.
- **AND** the active tab styling switches.

### Requirement: Date Filtering
The grid SHALL accurately filter matches based on the active tab and strict calendar rules.

#### Scenario: Today's Tab
- **WHEN** 'Jogos de Hoje' is active
- **THEN** it renders only matches whose date strictly aligns with 2026-06-22.

#### Scenario: Empty state for Future Tab
- **WHEN** 'Jogos Futuros' is active and no future matches were fetched in the limit
- **THEN** it displays the `<EmptyState />` cleanly.
