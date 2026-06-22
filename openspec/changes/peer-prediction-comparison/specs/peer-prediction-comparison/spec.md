## ADDED Requirements

### Requirement: Peer Selection and Query
The application SHALL render a dropdown menu allowing selection of a colleague, and upon selection, fetch their specific prediction records.

#### Scenario: User opens the dropdown
- **WHEN** the `MatchGrid` mounts
- **THEN** it queries `public.usuarios` ordered by `nome_guerra`.
- **AND** populates the `<select>` element.

#### Scenario: User selects a peer
- **WHEN** the dropdown value changes
- **THEN** the system queries `public.palpites` for that specific `usuario_id`.
- **AND** updates the UI to show `👥 Palpite de [NOME]: [A] x [B]` underneath matches where the peer has a recorded guess.
