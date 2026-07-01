## ADDED Requirements

### Requirement: Tabela de Ligas e Relação com Usuários
O banco de dados MUST possuir a tabela `ligas` para armazenar grupos e a tabela associativa `membros_liga` para representar quais usuários pertencem a quais ligas (relação N:N).

#### Scenario: Criação de Nova Liga
- **WHEN** um usuário cria uma nova liga
- **THEN** uma nova linha é inserida na tabela `ligas` com um código de convite único e o criador é automaticamente associado via `membros_liga`

### Requirement: Isolamento RLS de Membros
O banco de dados MUST implementar políticas de RLS que restrinjam o acesso de leitura à tabela `membros_liga` garantindo que um usuário apenas visualize registros de ligas às quais ele já pertence.

#### Scenario: Leitura de membros não autorizada
- **WHEN** o usuário X tenta ler a tabela `membros_liga` filtrando pela liga Y, e o usuário X não é membro da liga Y
- **THEN** a política RLS bloqueia a leitura e retorna 0 resultados

### Requirement: Migração Default sem Downtime
O sistema MUST prover um script SQL que cria automaticamente a liga "Bolão Oficial" e associa todos os usuários existentes atualmente na tabela `usuarios` a esta liga como fallback inicial.

#### Scenario: Acesso de usuário legado
- **WHEN** um usuário que se cadastrou na V1 abre o aplicativo após o deploy da V2
- **THEN** ele já existe dentro da tabela `membros_liga` associado à liga "Bolão Oficial", prevenindo falhas na UI futura
