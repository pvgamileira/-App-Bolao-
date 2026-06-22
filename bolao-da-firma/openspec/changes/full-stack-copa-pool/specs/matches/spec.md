## ADDED Requirements

### Requirement: Daily Matches Display
The system SHALL display a list of daily matches using a card layout, showing team names and logos. Each card MUST have side-by-side score inputs for the user's guess, separated by a central 'X'.

#### Scenario: User views daily matches
- **WHEN** the user navigates to the Matches screen
- **THEN** they see the matches available for guessing with input fields.

### Requirement: Save Guesses Button
The system SHALL display a sticky or floating "Salvar Meus Palpites" (Save My Guesses) button at the bottom of the screen.

#### Scenario: User saves guesses
- **WHEN** the user inputs scores and clicks "Salvar Meus Palpites"
- **THEN** the system saves the guesses to the database and shows a success confirmation.
