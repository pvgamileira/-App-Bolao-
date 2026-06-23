## Context

Atualmente o Vite com React Strict Mode (v18+) recarrega `main.tsx` diversas vezes durante a inicialização (HMR). No entanto, o `createRoot` está sendo chamado incondicionalmente no DOM node `#root`. Isso tem levado a comportamentos em que um estado corrompido ou falha no HMR (ex. decorrente de bugs de websocket no Realtime) faz a árvore de componentes renderizar duas vezes no mesmo container, criando uma experiência de "tela duplicada" (Dois Logins na tela).
Adicionalmente, a Edge function `sync-matches` foi ajustada logicamente para puxar os jogos do dia 11 de junho (Início da Copa), mas não está acoplada no pipeline de Continuous Deployment de maneira simples que o usuário possa usar facilmente sem um script explícito.

## Goals / Non-Goals

**Goals:**
- Proteger `createRoot` contra múltiplas inicializações anexando a raiz ao escopo global ou desanexando antes do novo root.
- Documentar os comandos de deploy e execução da Edge Function do Supabase.

**Non-Goals:**
- Reescrever ou desabilitar o React Strict Mode, ou o Fast Refresh do Vite, pois eles são ferramentas valiosas.

## Decisions

1. **Singleton Root**: No `main.tsx`, checaremos e destruiremos o root anterior se ele já foi criado em recarregamentos passados pela referência guardada, garantindo um "clean slate".
2. **Supabase Deploy Manual**: Providenciaremos os comandos `supabase functions deploy sync-matches` e `curl` via Supabase CLI no prompt de "apply" para atualizar o DB em Produção sem código frontend adicional.

## Risks / Trade-offs

- **Memory Leak Local**: Salvar referências no objeto `window` em dev pode manter contextos velhos, mas o recarregamento final da página limpa tudo de qualquer forma.
