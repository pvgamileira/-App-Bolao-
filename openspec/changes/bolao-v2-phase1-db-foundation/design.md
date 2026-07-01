## Context
O Bolão da Firma V1 foi desenhado com uma estrutura flat (Single-tenant). O ranking é montado a partir de um somatório global dos pontos de todos os usuários. Para suportar múltiplos grupos (Bolões/Ligas Privadas), a base de dados precisa ser reestruturada.
A Fase 1 deste projeto cuida exclusivamente do modelo de dados e da segurança em nível de linha (RLS) no Supabase, garantindo que usuários possam pertencer a múltiplas ligas sem que ocorra vazamento de informações.

## Goals / Non-Goals

**Goals:**
- Criar a tabela `ligas` que armazenará as informações de cada grupo (código de convite, nome do criador, status).
- Criar a tabela associativa `membros_liga` (N:N) que conectará um usuário a uma ou mais ligas.
- Criar a "Liga Oficial" de forma automatizada no banco de dados.
- Migrar os usuários já existentes na plataforma para a "Liga Oficial".
- Habilitar RLS nas novas tabelas para isolamento restrito de acesso.

**Non-Goals:**
- Modificar o Frontend (Telas, Botões, Dropdowns). O app continuará com o visual Single-tenant nesta fase.
- Alterar o cálculo de pontos de palpites ou a tabela atual de `jogos`.
- Criar o painel visual do Administrador da Liga.

## Decisions

### 1. Migração Invisível e Liga Default ("Bolão da Firma")
**Decisão:** Ao criar as novas estruturas `ligas` e `membros_liga`, será criado via SQL uma liga padrão chamada "Bolão da Firma Oficial", e todos os usuários que já possuem conta no Supabase serão injetados na tabela `membros_liga` com o ID desta liga.
**Rationale:** Isso garante Zero Downtime. A interface atual continuará funcionando sem quebrar. Se mudássemos tudo e deixássemos os usuários sem liga até eles clicarem num botão "Entrar", os cálculos e históricos iriam desaparecer repentinamente da tela deles.

### 2. Criação do AULA_FASE1.md
**Decisão:** Paralelamente à implementação, toda alteração de banco de dados (SQL, RLS Policies) será explicada didaticamente em um arquivo separado.
**Rationale:** O Product Owner tem background em HTML/JS e está utilizando o desenvolvimento guiado por IA para aprender arquitetura de Backend/Supabase. Esse documento atua como ponte educacional, garantindo que o mantenedor do software domine as alterações profundas sendo realizadas.

### 3. Modelo Isolado de RLS (Row Level Security)
**Decisão:** A tabela `ligas` será pública para quem tem o "código de convite", mas a tabela `membros_liga` será extremamente restrita. O usuário só consegue ler os membros se ele também for um membro daquela respectiva liga.
**Rationale:** Prevenir que um atacante consiga listar todos os usuários de ligas privadas fazendo scraping da API.

## Risks / Trade-offs
- **Risco:** O frontend já possuir alguma query restrita que acabe falhando por conta das novas RLS (Row Level Security).
  - **Mitigação:** Como as tabelas `ligas` e `membros_liga` são novas, elas não impactam as queries existentes nas tabelas `usuarios` e `jogos` (cujas RLS não serão modificadas).
- **Risco:** A migração SQL falhar para alguns usuários.
  - **Mitigação:** A migração rodará dentro de uma transação (`BEGIN; ... COMMIT;`). Se um usuário falhar, a query toda dá *rollback* e avisa do erro sem corromper o banco parcialmente.
