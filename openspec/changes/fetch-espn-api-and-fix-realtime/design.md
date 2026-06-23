## Context

O backend do aplicativo de Bolão precisa se manter atualizado com os jogos reais da Copa do Mundo de 2026. A API da ESPN provê esses dados gratuitamente. 
Além disso, no front-end, uma conexão realtime do Supabase em `App.tsx` não está lidando corretamente com o `useEffect` executando duas vezes no Strict Mode do React, resultando no erro: `Uncaught Error: cannot add postgres_changes callbacks for realtime:schema-db-changes after subscribe()`.

## Goals / Non-Goals

**Goals:**
- Construir um script (ex: Node.js) que busque os jogos na API da ESPN, mapeie para o formato do Supabase e atualize/insira na tabela `jogos`.
- Corrigir o erro de lifecycle no hook `useEffect` do `App.tsx` alterando a inicialização do canal Realtime do Supabase.

**Non-Goals:**
- Migrar todo o banco para depender 100% da ESPN em tempo real no frontend (a inserção continuará sendo consolidada no Supabase).

## Decisions

1. **ESPN API Script**: Um script autônomo (ex. `sync_espn.js`) ou função Supabase que consumirá o endpoint da ESPN e fará o `upsert` na tabela de `jogos`.
2. **Realtime Fix**: O `useEffect` que inicia o canal `schema-db-changes` no `App.tsx` será alterado para usar um identificador único a cada render (como `schema-db-changes-${Date.now()}` ou `crypto.randomUUID()`) ou garantiremos um `removeChannel` robusto garantido de ser chamado antes do próximo `channel()` para evitar colisões no ambiente de dev do Vite/React 18.

## Risks / Trade-offs

- Dependência do payload e documentação (não-oficial) da API da ESPN. Se eles mudarem o formato, o script quebra.
- A correção do realtime do Supabase com identificador único criará múltiplos canais temporários, que serão destruídos assim que o socket for fechado. É mais seguro no desenvolvimento.
