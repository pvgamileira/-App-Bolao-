## 1. Habilitar edição de palpites

- [x] 1.1 Em `MatchGrid.tsx`, na declaração da variável `hasPendingMatches`, alterar a lógica para `hasPendingEdits` que checa se os valores em `guesses` são diferentes de `savedGuesses` para jogos com status `SCHEDULED`.
- [x] 1.2 Em `MatchGrid.tsx`, remover a restrição `|| !!savedGuesses[match.id]` da propriedade `disabled` nos inputs de palpite numéricos.
- [x] 1.3 Em `MatchGrid.tsx`, remover a restrição `|| !!savedGuesses[match.id]` da checagem de estilo (className) que aplica opacidade e cursor-not-allowed nos inputs.
- [x] 1.4 Em `MatchGrid.tsx`, atualizar a exibição do botão "Salvar Meus Palpites" no rodapé para depender de `hasPendingEdits` (renderizar se `hasPendingEdits` for true).
