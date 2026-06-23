## Why

Atualmente, existem 5 usuários no banco de dados que foram importados de uma planilha antiga. Estes usuários têm o campo `pin` igual a `null` (ou vazio). O fluxo de login atual permite que usuários com `pin` vazio entrem diretamente se não digitarem a senha ou dá erro genérico. Além disso, se eles tentarem usar a aba "Criar Conta", o sistema bloqueia exibindo "Nome de Guerra já está em uso", o que significa que eles estão travados ou acessando de forma insegura. Precisamos de um fluxo de "Primeiro Acesso" que exija que eles definam uma senha para poder logar e continuar usando a conta legada.

## What Changes

1. **Aba "ENTRAR"**: Se um usuário tentar logar e o banco retornar que o `pin` dele está `null`, bloquearemos o login e exibiremos a mensagem amigável: "Sua conta é legada e ainda não possui senha. Por favor, vá em 'Criar Conta' para definir seu PIN de acesso inicial."
2. **Aba "CRIAR"**: Em vez de fazer um `insert` direto, a lógica buscará se o usuário já existe.
   - Se o usuário não existir: Faz o `insert` normal.
   - Se o usuário existir e o `pin` for `null`: Faz um `update` na tabela `usuarios`, definindo a senha que o usuário digitou no campo PIN. Assim ele cadastra o PIN para o primeiro acesso.
   - Se o usuário existir e o `pin` NÃO for `null`: O sistema informa "Nome de Guerra já está em uso."

## Capabilities

### Modified Capabilities
- **Autenticação (`auth-form`)**: O formulário de login passa a suportar validação de conta legada (PIN nulo) e a criação de contas passa a suportar "reivindicar" (claim) uma conta legada preexistente definindo sua senha inicial.

## Impact
- **Segurança:** Os usuários antigos terão acesso protegido, sem furos no sistema.
- **UX:** Resolução do travamento ("Nome em uso" vs "Senha incorreta"), com instruções claras na própria tela.
