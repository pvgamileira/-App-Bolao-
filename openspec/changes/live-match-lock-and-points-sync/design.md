## Context
- **Bloqueio de Jogo:** Quando a hora do jogo chega, o backend (`jogos.status`) muitas vezes demora a ser atualizado para `'LIVE'` caso não haja automação ou cron jobs configurados. Isso permite que usuários submetam palpites enquanto o jogo já acontece.
- **Pontuação Inconsistente:** A tabela base (`Palpites da Copa1.pdf`) mostra valores consolidados que diferem da nossa soma de (`pontos_legado` + `pontos_ganhos`). O cálculo exato depende de dezenas de jogos com pontuações complexas. O método mais seguro de resolver agora é sincronizar ajustando a base de `pontos_legado`.

## Goals / Non-Goals
**Goals:**
- Bloquear a UI para edições baseando-se estritamente na data e hora local em relação à data e hora do jogo, sobrescrevendo `'SCHEDULED'` para `'LIVE'`.
- Garantir a visibilidade dos pontos exatos exibidos no PDF.

**Non-Goals:**
- Refazer o cálculo de pontos de cada partida histórica. (Vamos aplicar a correção de diferença direto na variável de estado legado).
- Implementar um cronjob backend para atualizar status. A trava no frontend associada à trava lógica na base será suficiente para a experiência do usuário.

## Decisions
1. Em `App.tsx`, ao realizar o `map` nos jogos (`fetchMatches`), adicionaremos a lógica:
   ```ts
   const matchDate = new Date(j.data_hora);
   let computedStatus = j.status || 'SCHEDULED';
   if (computedStatus === 'SCHEDULED' && new Date() >= matchDate) {
      computedStatus = 'LIVE';
   }
   ```
2. Ao invés de código complexo de UI para a pontuação, rodaremos uma Query/Update via node (um script local rápido `fix_pontos.js`) que calcula exatamente `Target_PDF - Sum(pontos_ganhos)` e faz o `update` no campo `pontos_legado` na tabela `usuarios`. Isso encerra a divergência imediatamente e de forma limpa.
