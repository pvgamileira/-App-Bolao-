## Why

Atualmente, o frontend desativa (bloqueia) os campos de input de placar assim que um palpite é registrado (`!!savedGuesses[match.id]`). Isso impede que os usuários mudem de ideia ou ajustem seus palpites antes do jogo começar. O comportamento ideal, exigido pela turma, é que o palpite permaneça editável e possa ser atualizado a qualquer momento, bloqueando a edição estritamente quando o status do jogo mudar para `'LIVE'` (Ao vivo) ou `'FINISHED'` (Encerrado).

## What Changes

1. **Desbloqueio de Campos:** No arquivo `MatchGrid.tsx`, a propriedade `disabled` dos inputs de placar não considerará mais a existência de um palpite salvo (`!!savedGuesses[match.id]`) como fator de bloqueio.
2. **Atualização Visual:** O styling de "cursor-not-allowed" e opacidade também removerão a checagem de palpite já salvo, dependendo apenas do status da partida.
3. **Estado Alterado vs Salvo:** Como o usuário pode alterar um palpite já salvo, precisaremos garantir que o botão "Salvar Meus Palpites" detecte se há edições pendentes em relação aos `savedGuesses`. O botão já mapeia o estado `guesses`, que sobrescreverá os dados na base via `upsert`.

## Capabilities

### Modified Capabilities
- **Gerenciamento de Palpites (`match-grid`)**: Os palpites passam a ser completamente mutáveis até o início do jogo (status `SCHEDULED`).

## Impact
- **Flexibilidade:** Usuários podem corrigir erros de digitação ou mudar de palpite de última hora.
- **Competição:** Aumenta o dinamismo do bolão antes das partidas iniciarem.
