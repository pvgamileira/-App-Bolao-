## ADDED Requirements

### Requirement: Consistência de Pontuação com Prorrogação
O cálculo de pontos (trigger do banco) DEVE considerar o placar oficial gravado na tabela `jogos` para determinar acertos de vitória ou empate, independente do jogo ter ido para os pênaltis.

#### Scenario: Empate com vitória nos pênaltis não afeta regra de empate
- **WHEN** um jogo oficializa um placar de empate (ex: 1x1) e vai para os pênaltis (`foi_para_penaltis = true`, `vencedor_penaltis = 'A'`)
- **THEN** o usuário que palpitou empate (ex: 1x1 ou 2x2) receberá os pontos de acerto de placar exato ou vencedor/empate, ignorando quem venceu os pênaltis.
