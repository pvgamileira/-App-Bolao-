## 1. Implementar Trava Dinâmica no Frontend
- [x] 1.1 Em `App.tsx`, localizar o mapeamento `j.status || 'SCHEDULED'` dentro de `fetchMatches`.
- [x] 1.2 Converter a `data_hora` (`matchDate`) e comparar com `new Date()`. Se o jogo está no passado e o status é `'SCHEDULED'`, forçar o status no objeto da partida para `'LIVE'`.

## 2. Corrigir Pontuação do Leaderboard
- [x] 2.1 Criar e rodar um script utilitário (`scripts/fix_points.js`) que define explicitamente a pontuação base legado (`pontos_legado`) para subtrair a diferença exata dos pontos ganhos em sistema e bater com os valores da versão impressa PDF (Gabriel 106, Thyago 104, Enos 94, Paulo 92, Jairo 90).
