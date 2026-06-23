### MODIFIED Requirements

#### Feature: Autenticação Segura para Contas Legadas
Bloqueia o login e força contas importadas a cadastrarem uma senha (PIN) no primeiro acesso.

#### Scenario: Login com PIN nulo na aba ENTRAR
Given a user exists in the database with a null `pin`
When the user attempts to log in using the "ENTRAR" tab
Then the system SHALL block the login
And the system SHALL display the message "Sua conta ainda não possui senha. Por favor, vá em 'Criar Conta' para definir seu PIN de acesso inicial."

#### Scenario: Cadastrando PIN na aba CRIAR (Primeiro Acesso)
Given a user exists in the database with a null `pin`
When the user attempts to create an account with the same name and a valid PIN
Then the system SHALL update the existing user's PIN instead of throwing an error
And the user SHALL be logged in successfully.

#### Scenario: Tentativa de re-cadastrar conta com PIN já existente
Given a user exists in the database with a non-null `pin`
When the user attempts to create an account with the same name
Then the system SHALL block the creation
And the system SHALL display "Nome de Guerra já está em uso."
