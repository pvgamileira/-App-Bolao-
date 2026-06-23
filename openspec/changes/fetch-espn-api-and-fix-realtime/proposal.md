## Why

Atualmente, o banco de dados depende de inserções manuais via script SQL, o que não escala bem para obter pontuações oficiais e horários atualizados da Copa de 2026. Precisamos de uma integração automática via API (ESPN) para popular a tabela `jogos` e refletir dados reais. Além disso, a aplicação (React Strict Mode) está emitindo um erro fatal no console (`Uncaught Error: cannot add postgres_changes callbacks... after subscribe()`) relacionado à falta de limpeza (cleanup) adequada dos canais do Supabase Realtime durante os re-renders do componente principal.

## What Changes

- **Integração com API Externa**: Criação de um script/função backend para buscar os jogos da Copa do Mundo de 2026 da API da ESPN e atualizar a tabela `jogos` do Supabase.
- **Supabase Realtime Fix**: Modificação do `useEffect` em `App.tsx` para realizar o cleanup correto do canal `schema-db-changes` ou utilizar um nome dinâmico para evitar colisões no React Strict Mode.

## Capabilities

### New Capabilities
- `espn-match-sync`: Capacidade de buscar dados de partidas da API da ESPN e sincronizá-los com o Supabase.

### Modified Capabilities
- `realtime-updates`: A assinatura (subscribe) de atualizações em tempo real precisa ter seu ciclo de vida ajustado para evitar crashes.

## Impact

- **Backend / Scripts**: Novo código Node/Edge Function para rodar periodicamente ou sob demanda e integrar com a API.
- **Frontend (`App.tsx`)**: O hook responsável por manter a conexão realtime será atualizado.
