## ADDED Requirements

### Requirement: Database Schema Definition
The system SHALL establish a relational schema for managing the "Bolão da Copa", consisting of `usuarios`, `jogos`, and `palpites`.

#### Scenario: User table creation
- **WHEN** the migration script runs
- **THEN** it creates the `usuarios` table with columns `id` (UUID), `nome_guerra` (varchar unique), `pin` (varchar null), and `pontos_legado` (integer default 0).

#### Scenario: Match table creation
- **WHEN** the migration script runs
- **THEN** it creates the `jogos` table with columns `id` (UUID), `time_a`, `time_b`, `data_hora` (timestamptz), `placar_oficial_a`, and `placar_oficial_b`.

#### Scenario: Predictions table creation
- **WHEN** the migration script runs
- **THEN** it creates the `palpites` table with foreign keys `usuario_id` and `jogo_id`, and columns `palpite_a`, `palpite_b`, and `pontos_ganhos`.

### Requirement: Unique Predictions Constraint
The system SHALL enforce that a user can only have one prediction per match.

#### Scenario: Duplicate prediction prevention
- **WHEN** a user attempts to create a second prediction for the same `jogo_id`
- **THEN** the database rejects the insertion due to a composite UNIQUE constraint on `(usuario_id, jogo_id)`.
