### Requirement: Pontuação Funcional para Insert e Update

**Contexto**: Inserções de jogos que já estão finalizados pela API (Edge Function) deixam a base de palpites com pontuações vazias, ou nulas.
**Ação**: A `trigger` do Supabase para atualização de pontos nos palpites deverá observar ambos `INSERT OR UPDATE`. Além disso, o gatilho deverá validar se a operação foi um Insert com status concluído, rodando a lógica adequadamente em vez de quebrar devido ao valor de OLD inexistente.

### Requirement: Retroactive Point Recalculation

**Contexto**: O sistema atual possui vários palpites (do Excel e jogos passados) travados em `0 pontos`.
**Ação**: Após atualizar a trigger, realizar um "dummy update" nos jogos que tenham status 'FINISHED' forçará a engine do PostgreSQL a disparar a nova trigger de recalcular as pontuações e aplicar as regras a todos os palpites afetados.
