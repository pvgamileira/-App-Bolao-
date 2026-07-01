## 1. Foundation & Global Styles

- [x] 1.1 Refatorar `index.css` para incluir variáveis CSS do novo design system (cores premium, background escuro, tipografia).
- [x] 1.2 Atualizar o componente de Layout (ou `App.tsx` container principal) para aplicar o background global escuro e a fonte padrão.

## 2. Core Components Redesign

- [x] 2.1 Refatorar o cabeçalho/barra de navegação para usar `backdrop-blur` (glassmorphism) e ajustar o espaçamento.
- [x] 2.2 Refatorar o componente `MatchGrid.tsx` (cards de jogos) para usar bordas sutis (`border-slate-800`), cores de fundo (`bg-slate-900`) e hover states dinâmicos (`hover:scale-105`, `hover:border-slate-700`).
- [x] 2.3 Refatorar o modal de palpites (dentro do `MatchGrid` ou arquivo separado) para utilizar o estilo de glassmorphism e inputs modernos.

## 3. Leaderboard & Stats

- [x] 3.1 Refatorar o `LeaderboardPodium.tsx` para apresentar um visual mais premium, destacando os líderes com micro-animações (ex: brilho sutil ou gradiente no topo do pódio).
- [x] 3.2 Refatorar a lista de classificação geral com cores zebradas sutis e tipografia clara.

## 4. Final Polish & Micro-interactions

- [x] 4.1 Revisar todas as transições (`transition-all`, `duration-300`) em botões, links e cards.
- [x] 4.2 Garantir que o design esteja perfeitamente responsivo (mobile-first) em todas as telas reformuladas.
