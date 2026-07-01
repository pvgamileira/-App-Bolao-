## 1. Database Creation

- [x] 1.1 Criar a tabela `ligas` no Supabase via script SQL (colunas: id, nome, codigo_convite, criador_id, created_at).
- [x] 1.2 Criar a tabela associativa `membros_liga` (colunas: id, usuario_id, liga_id, saldo_pontos, created_at) com chaves estrangeiras.

## 2. RLS Security Policies

- [x] 2.1 Habilitar RLS na tabela `ligas` (Leitura pública se possuir o código, ou logado).
- [x] 2.2 Habilitar RLS na tabela `membros_liga`. Criar política onde um usuário só pode fazer SELECT se o `auth.uid()` for igual ao `usuario_id` ou se ele já for membro da mesma liga.
- [x] 2.3 Validar que as políticas de insert funcionam para novos membros.

## 3. The Seamless Migration

- [x] 3.1 Executar a criação manual da "Liga Oficial (Bolão da Firma)" na tabela `ligas`.
- [x] 3.2 Executar o script SQL de migração que faz o `INSERT INTO membros_liga` puxando todos os usuários atuais da tabela `usuarios` e vinculando ao ID da Liga Oficial.

## 4. Documentação Didática

- [x] 4.1 Criar o arquivo `AULA_FASE1.md` em `openspec/changes/bolao-v2-phase1-db-foundation/AULA_FASE1.md`.
- [x] 4.2 Documentar linha a linha o SQL executado nas etapas 1, 2 e 3 de forma simples com analogias em HTML/JS para o desenvolvedor frontend.
