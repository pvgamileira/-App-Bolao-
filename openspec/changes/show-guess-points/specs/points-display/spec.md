### ADDED Requirements

#### Feature: Potencial da Rodada
Exibe quantos pontos estão em disputa na tela atual.

#### Scenario: Visualizando jogos pendentes
Given the user is on the "Jogos de Hoje" or "Todos os Jogos" tab
When there are matches with status "SCHEDULED"
Then a banner should display "Potencial Máximo: X pontos" where X is pending matches * 5
And clicking an info icon should show an alert explaining the rules.

### MODIFIED Requirements

#### Feature: Feedback do Palpite no MatchGrid
Os jogos já finalizados mostrarão a pontuação conquistada pelo palpite do usuário.

#### Scenario: Jogo encerrado com palpite
Given the user has registered a guess for a match
When the match status changes to "FINISHED"
Then the UI should display "Seu palpite registrado: A x B"
And a badge next to it should display "+X pts" (where X is the points earned from the database).
