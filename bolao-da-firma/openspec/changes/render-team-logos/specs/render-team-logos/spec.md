## ADDED Requirements

### Requirement: Render External Logos
The system SHALL display team logos fetched from the database when available.

#### Scenario: Logo is present
- **WHEN** the `match` object contains a valid `logoA` or `logoB` URL
- **THEN** it renders an `<img>` tag with the source pointing to the URL, using `object-contain` for proper aspect ratio.

#### Scenario: Logo is missing
- **WHEN** the `logoA` or `logoB` property is null or undefined
- **THEN** it falls back to the default flag placeholder text or a clean empty container.
