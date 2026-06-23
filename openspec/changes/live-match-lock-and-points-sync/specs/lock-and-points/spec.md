### MODIFIED Requirements

#### Feature: Bloqueio Temporal de Partidas
Garante que usuários não possam inserir ou editar palpites quando a partida já atingiu ou ultrapassou sua data e hora de início, independentemente do backend ter processado a mudança de status.

#### Scenario: Visualizando jogos após a hora de início
Given the application fetches a list of matches
When a match has `data_hora` in the past and its `status` is still `'SCHEDULED'`
Then the frontend SHALL override its status to `'LIVE'`
And the score inputs for that match SHALL be visually disabled and locked.

#### Feature: Sincronização de Leaderboard
Garante que a pontuação total do usuário no aplicativo reflita exatamente os valores consolidados.

#### Scenario: Correção manual da pontuação
Given the official PDF states exact points for legacy users
When the correction script is run
Then the `pontos_legado` column SHALL be updated such that the sum `pontos_legado` + `pontos_ganhos` matches the official target perfectly.
