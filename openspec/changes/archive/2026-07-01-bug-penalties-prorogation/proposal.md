## Why

Durante a fase de mata-mata da Copa, os jogos frequentemente passam dos 90 minutos normais e vão para prorrogação ou disputa de pênaltis. O sistema atual de resultados (`placar_oficial_a` e `placar_oficial_b`) não é capaz de distinguir se um empate foi resolvido nos pênaltis ou quem avançou de fase. Isso impede que a interface do usuário mostre quem realmente venceu a disputa, gerando confusão.

## What Changes

- **Banco de Dados (Tabela `jogos`)**:
  - Adição de flags e colunas para registrar a extensão da partida: `foi_para_prorogacao` (boolean), `foi_para_penaltis` (boolean) e `vencedor_penaltis` ('A' ou 'B').
- **Lógica de Pontuação (Trigger)**:
  - Definir se a regra de pontuação do bolão contabiliza apenas o tempo normal ou se inclui a prorrogação para cálculo dos gols (normalmente, bolões usam o resultado final após prorrogação, ignorando os gols de pênalti). Isso não será uma quebra, mas precisa ser consolidado.
- **Frontend (UI de Resultados)**:
  - A interface precisará exibir marcadores visuais (badges) em jogos que foram decididos na prorrogação ou nos pênaltis.
  - Exibição de um ícone ou cor destacada indicando o time vencedor da disputa de pênaltis, mesmo quando o placar em gols estiver empatado.

## Capabilities

### New Capabilities
- `match-extensions`: Rastreamento de tempo extra (prorrogação) e disputas de pênaltis para jogos finalizados, incluindo a exibição visual (UI) desses estados.

### Modified Capabilities
- `scoring-rules`: Adaptação do cálculo de pontos para lidar de forma consistente e previsível com os placares de jogos que vão para prorrogação/pênaltis.

## Impact

- **Banco de Dados**: Tabela `jogos` será alterada via SQL migration.
- **Backend/Triggers**: A função de cálculo `update_user_points_on_match_finish` precisará de pequenas validações para assegurar qual placar usar.
- **Frontend**: Componentes de listagem de jogos (`MatchList`, `MatchCard`, etc.) precisarão consumir os novos campos.
