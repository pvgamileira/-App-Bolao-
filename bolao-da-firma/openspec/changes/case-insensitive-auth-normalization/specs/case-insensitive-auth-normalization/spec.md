## ADDED Requirements

### Requirement: Case-Insensitive Name Entry
The authentication form SHALL format the user's name to uppercase before attempting login or registration to match strict database constraints.

#### Scenario: User types name in lowercase
- **WHEN** the user types "john doe" and clicks ENTRAR
- **THEN** the system formats it to "JOHN DOE"
- **AND** successfully matches the "JOHN DOE" record in `public.usuarios`.

#### Scenario: User registration normalizes names
- **WHEN** the user creates an account
- **THEN** the system ensures the stored record is fully uppercase.
