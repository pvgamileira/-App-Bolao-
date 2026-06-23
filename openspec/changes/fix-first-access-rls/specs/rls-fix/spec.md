### MODIFIED Requirements

#### Feature: Correção de RLS para UPDATE de PIN
Garante que a política do Supabase permita a gravação do PIN nas contas legadas.

#### Scenario: Atualizando PIN via API
Given the user exists and has a null `pin`
When the frontend sends an UPDATE request to `usuarios`
Then the Supabase RLS SHALL allow the update
And the PIN SHALL be successfully persisted in the database.
