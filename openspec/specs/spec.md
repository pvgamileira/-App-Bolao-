## ADDED Requirements

### Requirement: Exibição de palpite para jogos finalizados
The system SHALL display the user's previously submitted guess alongside the official match result for matches that are already FINISHED, allowing the user to compare their guess with the actual result.

#### Scenario: User views a finished match where they made a guess
- **WHEN** the match `status` is `FINISHED` and the user has a submitted guess for this match
- **THEN** the match card displays the official score prominently in the center
- **THEN** the match card also displays the user's guess (e.g. "Seu palpite: 2 x 1") below or beside the official score
