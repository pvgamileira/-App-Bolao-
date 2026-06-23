### MODIFIED Requirements

#### Feature: Edição de Palpites
Usuários podem editar seus palpites a qualquer momento até que o jogo inicie.

#### Scenario: Editando um palpite antes do jogo
Given the user has registered a guess for a match
When the match status is still "SCHEDULED"
Then the score inputs SHALL remain enabled and editable
And modifying the inputs SHALL show the "Salvar" button.

#### Scenario: Jogo ao vivo bloqueia edição
Given the user has registered a guess for a match
When the match status changes to "LIVE"
Then the score inputs SHALL be disabled and visually locked.
