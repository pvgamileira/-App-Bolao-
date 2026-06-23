## Context

Os palpites no bolão são armazenados via UPSERT no Supabase (`usuario_id, jogo_id`). Logo, não há restrição técnica que impeça atualizações no banco. O bloqueio existente reside inteiramente no frontend, como uma regra rígida baseada em `!!savedGuesses[match.id]`.

## Goals / Non-Goals

**Goals:**
- Remover o bloqueio (`disabled`) dos inputs numéricos quando houver `savedGuesses[match.id]`.
- Garantir que o botão Flutuante "Salvar Meus Palpites" detecte se algum input na tela difere do estado salvo em `savedGuesses` OU se existem novos inputs não salvos. Se todos os inputs na tela forem idênticos ao que está salvo, o botão pode ser oculto ou desabilitado para evitar saves desnecessários. Mas para simplificar e seguir o padrão atual, podemos mantê-lo visível se houver jogos pendentes (o código atual faz `hasPendingMatches = filteredMatches.some(m => m.status === 'SCHEDULED' && !savedGuesses[m.id]);`).
- Mudar a verificação `hasPendingMatches` para também observar edições. Se um input `guesses[match.id]` for diferente de `savedGuesses[match.id]`, então temos edições pendentes.

**Non-Goals:**
- Modificar backend.
- Alterar restrições para jogos `LIVE` e `FINISHED` (estes continuam bloqueados).

## Decisions

1. **Desbloqueio de Inputs:**
Em `MatchGrid.tsx`, a propriedade `disabled` no `<input>` passará a ser:
`disabled={isMatchTbd || match.status !== 'SCHEDULED' || isSubmitting}`
*(Antes tinha `|| !!savedGuesses[match.id]`)*

2. **Detecção de Edição:**
Atualizar o cálculo do botão "Salvar".
`const hasPendingEdits = filteredMatches.some(m => m.status === 'SCHEDULED' && guesses[m.id] && (guesses[m.id].scoreA !== (savedGuesses[m.id]?.scoreA ?? '') || guesses[m.id].scoreB !== (savedGuesses[m.id]?.scoreB ?? '')));`
Exibir o botão Flutuante se `hasPendingEdits` for true.
