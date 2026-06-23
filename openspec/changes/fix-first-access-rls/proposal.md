## Why
Durante o teste da funcionalidade de Primeiro Acesso, percebemos que o usuário consegue passar pelo fluxo de "Criar Conta" com sucesso, entra no app, porém, quando sai e tenta logar novamente, o sistema acusa que ele ainda não possui senha. Isso ocorre porque o Supabase não possui uma política de `UPDATE` (Row Level Security - RLS) na tabela `usuarios`. Com isso, o comando de `.update({ pin: pin.trim() })` feito na interface do usuário "falha silenciosamente" (atualiza 0 linhas) e não salva a senha de fato no banco de dados, retornando sucesso falso.

## What Changes
Precisamos adicionar uma política de RLS (Row Level Security) que permita atualizar a tabela `usuarios`.
Para manter a segurança e a simplicidade, criaremos uma política `UPDATE` que permita a alteração dos registros anonimamente, o que resolverá a falha silenciosa.

## Capabilities
### Modified Capabilities
- **Acesso ao Banco de Dados (`schema`)**: A tabela `usuarios` passará a aceitar operações `UPDATE`, permitindo o registro da senha de primeiro acesso.

## Impact
- **Segurança e UX:** A senha será finalmente persistida no banco, completando perfeitamente o fluxo de "Primeiro Acesso" e permitindo que o usuário volte a logar com sua nova senha de forma correta.
