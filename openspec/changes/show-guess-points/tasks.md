## 1. Atualizar Types e Fetching

- [x] 1.1 Em `MatchGrid.tsx`, atualizar a interface `Guess` para adicionar a propriedade `points?: number | null`.
- [x] 1.2 Em `App.tsx`, atualizar a query da função `fetchUserGuesses` para buscar o campo `pontos_ganhos` (`.select('jogo_id, palpite_a, palpite_b, pontos_ganhos')`).
- [x] 1.3 Em `App.tsx`, mapear o `p.pontos_ganhos` para a propriedade `points` do objeto `Guess` gerado.

## 2. Implementar UI no MatchGrid

- [x] 2.1 Em `MatchGrid.tsx`, adicionar um pequeno badge ao lado do texto "Seu palpite registrado: X x Y" que renderize dinamicamente `+ N pts`. Usar estilo condicional (verde se > 0, cinza escuro se 0).
- [x] 2.2 Em `MatchGrid.tsx`, calcular o "potencial da rodada" multiplicando o número de jogos filtrados cujo status é 'SCHEDULED' por 5.
- [x] 2.3 Em `MatchGrid.tsx`, inserir um banner visual acima da listagem de jogos (mas abaixo dos filtros) informando o potencial da rodada, ex: "💰 Máximo de X pontos em jogo hoje" com um botão "(?)" para abrir um modal.
- [x] 2.4 Em `MatchGrid.tsx`, adicionar o modal explicativo ou função `window.alert` que será chamada ao clicar no "(?)", explicando que cada jogo não finalizado pode render até 5 pontos.
