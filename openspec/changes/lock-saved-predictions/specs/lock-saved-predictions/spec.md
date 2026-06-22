## ADDED Requirements

### Requirement: Prediction Confirmation
The system SHALL ask for user confirmation before saving predictions.

#### Scenario: User clicks save
- **WHEN** the user clicks "Salvar Meus Palpites"
- **THEN** a `window.confirm` dialog appears warning that they cannot be changed.
- **IF** they click Cancel, the operation aborts.

### Requirement: Input Freezing
The system SHALL freeze inputs for matches that already have a registered prediction.

#### Scenario: Match has a saved prediction
- **WHEN** the user has a confirmed palpite for a match
- **THEN** the inputs are disabled, stripped of focus borders, and a "✓ Palpite Registrado" badge is displayed.

### Requirement: Global Button Disabling
The "Salvar Meus Palpites" button SHALL NOT be available if there are no eligible pending matches.

#### Scenario: All matches predicted
- **WHEN** all `SCHEDULED` matches currently rendered already have saved predictions
- **THEN** the save button is disabled or hidden.
