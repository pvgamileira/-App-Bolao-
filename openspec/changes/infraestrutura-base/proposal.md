## Why

Mudar o gerenciamento do Bolão da Copa do Excel para uma aplicação web utilizando o Supabase para persistência de dados. O objetivo é isolar a lógica de cálculo de pontos do Bolão em TypeScript para maior manutenibilidade, testabilidade e integração, além de estruturar o banco relacional corretamente.

## What Changes

- Definição do banco de dados (DDL) no Supabase com três tabelas principais: `usuarios`, `jogos` e `palpites`.
- Criação do motor de pontuação em TypeScript contendo regras de placar exato, diferença de gols, acerto de vencedor e anulação de bônus de empate.
- Restrição UNIQUE composta para prevenir múltiplos palpites do mesmo usuário para o mesmo jogo.

## Capabilities

### New Capabilities
- `supabase-infra`: Infraestrutura de tabelas, tipos e chaves no banco de dados.
- `score-calculator`: Motor de cálculo isolado em TypeScript para pontuação dos palpites de acordo com regras específicas do torneio.

### Modified Capabilities
- N/A

## Impact

- Criação do schema SQL para criação de tabelas.
- Criação de nova camada utilitária (`src/utils/scoreCalculator.ts`).
