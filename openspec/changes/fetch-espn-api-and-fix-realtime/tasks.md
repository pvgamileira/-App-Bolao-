## 1. Frontend - Correção do Supabase Realtime

- [x] 1.1 Em `App.tsx`, modificar a inicialização do `supabase.channel()` para utilizar um nome dinâmico (ex. `schema-db-changes-${Date.now()}`).
- [x] 1.2 Garantir que o `useEffect` faça o cleanup removendo corretamente a inscrição ao desmontar o componente.

## 2. Script de Integração com ESPN API

- [x] 2.1 Criar script Node (`sync_espn.js` ou equivalente na pasta raiz/scripts) para se comunicar com a API da ESPN (futebol/copa).
- [x] 2.2 Implementar lógica de parser que converte os nomes dos times em inglês da ESPN para o formato do Supabase e lê o placar/status do jogo.
- [x] 2.3 Utilizar o SDK do `@supabase/supabase-js` para fazer upsert dos jogos na tabela `jogos` usando as chaves configuradas.
- [x] 2.4 Documentar no `README.md` (ou via comentário) como executar o script para sincronização.
