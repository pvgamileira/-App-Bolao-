## ADDED Requirements

### Requirement: Live Match UI State
The system SHALL read the `status` property of matches and reflect it in the UI.
- If `status` == 'LIVE': The card MUST display a subtle pulsating green dot badge labeled "LIVE" next to the teams.
- If `status` == 'LIVE' or 'FINISHED': The score inputs MUST be disabled to prevent user manipulation.
- If `status` == 'FINISHED': The card MUST show the official final scores locked.
