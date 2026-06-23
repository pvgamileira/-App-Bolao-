## Why

Atualmente, o banco de dados não possui os jogos da primeira fase da Copa que ocorreram antes do dia 22 de junho, fazendo com que o filtro dessas datas fique vazio. Além disso, a visualização no frontend precisa de melhorias: jogos futuros com times ainda não definidos precisam ser sinalizados e bloqueados para palpites, e nos jogos já finalizados (quando visualizados pelo filtro de datas antigas), o usuário deseja ver não só o placar oficial, mas também qual foi o seu próprio palpite lado a lado para saber se acertou.

## What Changes

- **Inserção de Dados**: Cadastro de todos os jogos anteriores ao dia 22/06 no banco de dados (Supabase).
- **Bloqueio de Palpites em Jogos Indefinidos**: Quando um jogo estiver agendado mas tiver um nome genérico (como "Group A 2nd Place"), os inputs serão desabilitados e exibiremos um aviso "Seleção não definida".
- **Visualização de Palpite e Resultado**: Para jogos com status `FINISHED`, ao invés de substituir o input pelo placar oficial, a interface mostrará o Placar Oficial em destaque e, logo abaixo/ao lado, o palpite que o usuário havia registrado, permitindo a comparação rápida.

## Capabilities

### New Capabilities
- `tbd-matches-display`: Sinalização visual e bloqueio de inputs para jogos que ainda não têm as seleções oficiais definidas.
- `guess-result-comparison`: Exibição simultânea do placar oficial e do palpite registrado pelo usuário para jogos finalizados.

### Modified Capabilities
*(Nenhuma capacidade existente modificada em nível de requisitos/spec)*

## Impact

- **Banco de Dados**: Criação e execução de script SQL para inserir os jogos passados na tabela `jogos`.
- **Frontend (`MatchGrid.tsx`)**: Atualização do layout do card de jogo para lidar com times indefinidos e para exibir múltiplas informações (placar + palpite) quando o jogo estiver encerrado.
