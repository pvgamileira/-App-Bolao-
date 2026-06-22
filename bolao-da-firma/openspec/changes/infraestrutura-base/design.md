## Context

O Bolão da Copa atual utilizava uma planilha Excel para gerenciar os palpites e calcular os pontos de cada usuário. Esse processo é manual, propenso a erros e difícil de escalar. Precisamos construir uma aplicação web, e o primeiro passo é a infraestrutura do banco de dados (Supabase) e a lógica de pontuação (TypeScript).

## Goals / Non-Goals

**Goals:**
- Definir o DDL completo para tabelas `usuarios`, `jogos` e `palpites`.
- Incluir as restrições necessárias, como a regra UNIQUE entre `usuario_id` e `jogo_id` na tabela de palpites.
- Implementar as regras do bolão em uma função pura TypeScript (placar exato, aproximação, vencedor, anulação do bônus de empate).

**Non-Goals:**
- Implementação de interface do usuário (UI) neste escopo.
- Lógica de autenticação completa (focaremos apenas nas tabelas).

## Decisions

- **Supabase para Banco de Dados**: Escolhido por fornecer PostgreSQL completo, gerando facilidade na gestão de dados e futuras integrações com front-end.
- **Motor de Pontuação em TypeScript**: O cálculo de pontos será isolado em uma função em `src/utils/scoreCalculator.ts`, em vez de utilizar funções nativas SQL. Isso permite testes unitários rigorosos e reaproveitamento em eventuais lógicas client-side (como simuladores de pontos).
- **Esquema Inicial**: As tabelas foram definidas de forma enxuta para atender as regras do bolão, utilizando UUID como chaves primárias para simplificar integrações remotas.

## Risks / Trade-offs

- **Sincronismo de Pontos**: Ao separar o cálculo em TypeScript e a base no Supabase, é preciso garantir que alterações no resultado do jogo acionem o recálculo dos pontos em todos os palpites. Mitigação: Em futuras implementações, isto deve ser tratado em webhooks ou funções server-side do Supabase, mas no escopo atual vamos prover a base lógica e relacional que permita tal arquitetura.
