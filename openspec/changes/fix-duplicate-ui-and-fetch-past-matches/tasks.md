## 1. Single Root no Frontend

- [x] 1.1 Em `src/main.tsx`, checar se `window.__reactRoot` já existe. Se existir, reutilizá-lo ou ignorar a nova chamada de `createRoot` dependendo do suporte de Fast Refresh. (ou unmount se necessário)

## 2. Deploy & Trigger Edge Function (Jogos Antigos)

- [x] 2.1 Fornecer o comando `npx supabase functions deploy sync-matches` no terminal ou documentação para atualizar a Edge Function no ambiente de produção.
- [x] 2.2 Acionar a função de Edge (Trigger via HTTP/Curl ou Supabase CLI serve) para popular a tabela `jogos` desde 2026-06-11.
