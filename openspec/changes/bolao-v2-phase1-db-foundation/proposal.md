## Why

O Bolão da Firma foi idealizado como um aplicativo "single-tenant", ou seja, todos os usuários competem globalmente na mesma liga. Para evoluir o produto para um SaaS (Software as a Service) completo (Bolão V2), precisamos isolar os usuários em "Grupos" ou "Ligas Privadas". 
A Fase 1 foca exclusivamente em pavimentar o banco de dados para suportar múltiplos grupos (Multi-tenant) sem alterar a interface visual do aplicativo atual ou quebrar os dados dos usuários legados.

## What Changes

- Criação da tabela `ligas` no Supabase para armazenar os grupos.
- Criação da tabela `membros_liga` para estabelecer a relação N:N entre Usuários e Ligas.
- Inserção de uma "Liga Oficial" (Bolão da Firma original) como semente inicial.
- Migração automática dos 5 usuários atuais para a Liga Oficial via script/SQL, garantindo que ninguém perca seus dados.
- Implementação de políticas RLS (Row Level Security) para garantir que apenas membros de uma liga possam acessar seus respectivos dados no futuro.
- Criação do documento `AULA_FASE1.md` com explicações didáticas da arquitetura de banco de dados para devs Frontend (HTML/JS).

## Capabilities

### New Capabilities
- `multi-tenant-core`: Define a estrutura de dados base para ligas, membros de liga e as políticas de isolamento de segurança necessárias para transformar o sistema em um SaaS.
- `didactic-documentation`: Criação de tutoriais passo-a-passo (SALA DE AULA) explicando o código gerado para facilitar o aprendizado e manutenção do criador do app.

### Modified Capabilities
- Nenhuma capacidade existente será modificada nesta fase; a estrutura multi-tenant servirá como alicerce paralelo e só impactará as rotas visuais nas Fases 2 em diante.

## Impact

- **Database:** Supabase (`ligas`, `membros_liga` tables, RLS policies).
- **Security:** O isolamento de dados será regido pelas políticas RLS.
- **Downtime:** Zero. A tela atual continua buscando os usuários da tabela global, a migração ocorre "por baixo dos panos".
