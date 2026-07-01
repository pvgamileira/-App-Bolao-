## ADDED Requirements

### Requirement: Documentação Didática de Arquitetura
A implementação DEVE gerar obrigatoriamente o arquivo `AULA_FASE1.md` dentro do diretório do change (`openspec/changes/bolao-v2-phase1-db-foundation/`).

#### Scenario: Geração da Aula Teórica
- **WHEN** a implementação cria e aplica os scripts SQL no Supabase
- **THEN** o arquivo `AULA_FASE1.md` é escrito com a explicação didática do código SQL, fazendo correlações em linguagem voltada para desenvolvedores HTML/JS, e contendo exemplos claros do impacto visual/lógico no sistema.
