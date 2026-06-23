## Context

O app Bolão está com dados da Copa incompletos no banco, iniciando apenas em 22/06. Para resolver isso, faremos uma inserção via query SQL (migration/seed).
No frontend, o `MatchGrid.tsx` precisa de melhorias visuais:
1. Jogos futuros dependem de resultados e possuem times em aberto (ex: "Group A 2nd Place"). Esses não devem permitir palpites e precisam ter um visual bloqueado/indefinido.
2. Jogos finalizados (`FINISHED`) substituem o input do usuário pelo placar oficial. Com isso, os usuários não conseguem lembrar qual palpite deram ao visualizar jogos passados.

## Goals / Non-Goals

**Goals:**
- Inserir os jogos anteriores ao dia 22/06 via um script SQL que possa ser executado no Supabase.
- Modificar o `MatchGrid.tsx` para interceptar jogos em que o nome do time contiver termos genéricos (ex: "Group", "Winner", "Round") ou for explicitamente nulo. Nestes casos, o input deve ser bloqueado com a mensagem "Seleção não definida".
- Modificar o `MatchGrid.tsx` para, em jogos `FINISHED`, exibir o placar oficial em destaque, e, se o usuário registrou um palpite, mostrar os valores numéricos do palpite abaixo ou ao lado (ex: "Meu Palpite: 2 x 1").

**Non-Goals:**
- Alterar o esquema do banco de dados (tabelas e triggers permanecem iguais).
- Automatizar o fetch de jogos de uma API externa (a inserção será manual/estática via SQL).

## Decisions

1. **Seed via SQL**: Ao invés de um script Node, usaremos um arquivo `.sql` na pasta supabase contendo os `INSERT` dos jogos faltantes. Assim o usuário pode executá-lo diretamente no SQL Editor do Supabase.
2. **Identificação de Times Indefinidos**: O frontend verificará se o `timeA` ou `timeB` contêm "Group", "Winner", "Place" ou "Round". Se sim, o componente renderizará "A Definir" no lugar do time e os inputs ficarão bloqueados (disabled) ou ocultos, substituídos por um aviso visual.
3. **Layout de Resultado vs Palpite**:
   Para jogos `FINISHED`:
   - Se houver `placarOficialA` e `B`, mostraremos o placar real centralizado com visual escurecido e chamativo.
   - Mostraremos um pequeno bloco verde ou vermelho abaixo, exibindo o `guess.scoreA` x `guess.scoreB` se ele existir, para mostrar ao usuário o que ele apostou.

## Risks / Trade-offs

- **Risk**: Pode ser difícil encontrar o SQL correto de todos os jogos passados.
- *Mitigation*: Vamos construir um script com base nas chaves fornecidas de um calendário padrão da Copa 2026.
- **Risk**: A tela `MatchGrid.tsx` pode ficar visualmente poluída exibindo placar oficial e palpite juntos.
- *Mitigation*: O palpite do usuário será exibido com uma fonte menor e mais discreta logo abaixo do placar oficial, mantendo a limpeza do design.
