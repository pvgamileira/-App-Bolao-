## ADDED Requirements

### Requirement: Database Tables Setup
The system SHALL have `usuarios`, `jogos`, and `palpites` tables defined with appropriate schemas, UUID primary keys, and relationships.

#### Scenario: System initialization
- **WHEN** the database migrations are applied
- **THEN** the `usuarios`, `jogos`, and `palpites` tables are created.

### Requirement: Constraints and Security
The system SHALL enforce a composite unique constraint on `(usuario_id, jogo_id)` in the `palpites` table and implement Row Level Security allowing frictionless inserts/reads.

#### Scenario: Duplicate guess prevention
- **WHEN** a user attempts to submit a second guess for the same match
- **THEN** the database rejects the insert due to the unique constraint.
