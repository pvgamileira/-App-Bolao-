## Why

O aplicativo React está renderizando o DOM principal (como a tela de login) duas vezes seguidas durante recarregamentos via HMR do Vite. Isso ocorre devido ao React 18+ em Strict Mode e chamadas redundantes a `createRoot` no `main.tsx`.
Além disso, a função `sync-matches` da Edge Function do Supabase foi corrigida para extrair os jogos da Copa de 2026 desde o início (2026-06-11), mas os dados ainda não refletiram no banco porque o novo código da Edge Function não foi executado. 

## What Changes

- Modificaremos o arquivo `src/main.tsx` para assegurar que apenas uma instância raiz do React (`root`) seja montada sobre a div `#root`, e armazenaremos a referência no objeto global `window` para evitar duplicação em HMR updates.
- Forneceremos o comando exato (via terminal) para que o desenvolvedor possa aplicar o deploy da Edge Function `sync-matches` para o Supabase e popular o banco de dados.

## Capabilities

### New Capabilities

Nenhuma nova capacidade no sistema de specs. Apenas correções de infraestrutura HMR e operação no banco.

### Modified Capabilities

- `espn-match-sync`: Ajustar o limite inicial para buscar jogos desde "2026-06-11", garantindo que a base de dados inclua jogos anteriores e corrigindo falhas de inicialização do frontend em HMR. (O frontend e a Edge Function mudam no nível de implementação, mas a spec pode incluir que "o app precisa lidar com HMR de forma singleton").

## Impact

- `src/main.tsx`
- Edge Function `supabase/functions/sync-matches` (apenas rodar o deploy)
- Tabela `jogos` do Supabase será atualizada corretamente com o histórico.
