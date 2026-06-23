## Why

Os usuários precisam de maior transparência sobre como a pontuação está sendo calculada em cada jogo. Atualmente, a pontuação é exibida apenas no Leaderboard como um total, mas o usuário não sabe quantos pontos ganhou em uma partida específica (por exemplo, ao acertar um 2 a 0 contra um placar oficial de 3 a 0 ganhando 1 ponto). Além disso, eles desejam saber o potencial máximo de pontos que podem conquistar na rodada atual.

## What Changes

1. **Badge de Pontos Ganhos:** Ao lado do palpite registrado em jogos `FINISHED`, um pequeno badge verde indicará o valor exato ganho (ex: `+3 pts`).
2. **Modal de Potencial da Rodada:** Um botão no topo da tela de jogos (`MatchGrid`) que exibe um modal ou alerta calculando o "Potencial Máximo" da aba ativa (Jogos de Hoje). O cálculo é simples: `(Número de jogos não finalizados na tela) * 5 pontos`.
3. **Query de Palpites:** Atualizar a query do `App.tsx` para selecionar o campo `pontos_ganhos` do banco de dados e repassá-lo ao `MatchGrid`.

## Capabilities

### Modified Capabilities
- **Acompanhamento de Resultados (`match-grid`)**: O grid de jogos passará a exibir a pontuação individual conquistada em cada jogo já finalizado, com um aviso visual sobre o potencial de ganho do dia.

## Impact
- **UX:** Feedback imediato e engajamento. Usuários saberão onde acertaram e quanto falta para virar o jogo na tabela.
