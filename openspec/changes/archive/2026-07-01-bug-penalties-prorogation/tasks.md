## 1. Banco de Dados

- [x] 1.1 Criar a migração SQL para adicionar as colunas `foi_para_prorogacao` (BOOLEAN DEFAULT FALSE), `foi_para_penaltis` (BOOLEAN DEFAULT FALSE) e `vencedor_penaltis` (VARCHAR(1) DEFAULT NULL) na tabela `public.jogos`.
- [x] 1.2 Atualizar o arquivo de definições de tipos do Supabase (`types/supabase.ts`) para incluir essas novas propriedades.

## 2. Trigger de Pontuação (Backend)

- [x] 2.1 Modificar a trigger `update_user_points_on_match_finish` para garantir que ela não faça cálculos usando gols de pênaltis caso os placares de pênaltis algum dia sejam mapeados nas colunas oficiais. Como o plano é usar flags isoladas, basta garantir que a trigger só dependa das colunas normais e adicionar comentários de salvaguarda.

## 3. Frontend (UI)

- [x] 3.1 Atualizar o componente de listagem de jogos (ex: `MatchCard` / `MatchList`) para verificar a flag `foi_para_prorogacao`. Se true, exibir um badge indicando que o jogo foi decidido na prorrogação.
- [x] 3.2 No mesmo componente, verificar a flag `foi_para_penaltis`. Se true, exibir o badge de Pênaltis.
- [x] 3.3 Se o jogo foi para os pênaltis, adicionar um indicador visual (ex: ícone de troféu ou texto "(P)") ao lado do time vencedor baseado na flag `vencedor_penaltis`.
