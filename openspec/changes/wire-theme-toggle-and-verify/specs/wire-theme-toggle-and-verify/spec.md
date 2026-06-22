## ADDED Requirements

### Requirement: Toggle Wiring
The header layout toggle SHALL dispatch state changes correctly to the global theme context and reflect the state visually.

#### Scenario: Verify Event Handling
- **WHEN** the user interacts with the toggle button
- **THEN** it triggers the context's `toggleTheme` function.

#### Scenario: Verify Visual Indicators
- **WHEN** the state evaluates to dark
- **THEN** the icon displays a Sun.
- **AND** when the state evaluates to light, it displays a Moon.
