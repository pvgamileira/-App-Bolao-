## Context

A autenticação é feita buscando ou inserindo um usuário na tabela `usuarios` baseado no `nome_guerra`. Historicamente, a importação populou a tabela com `pin = null`. O formulário do frontend (`AuthForm.tsx`) trata as abas `CRIAR` e `ENTRAR`. Para resolver o bloqueio dos usuários importados, precisamos que eles possam definir sua senha no primeiro acesso e não entrem no sistema sem definir esse PIN.

## Goals / Non-Goals

**Goals:**
- Bloquear logins na aba "ENTRAR" se `data.pin` for nulo, informando o usuário para criar a conta.
- Permitir que a aba "CRIAR" faça uma checagem (Select) prévia. Se achar o usuário, e ele tiver `pin = null`, faz um `update` da senha em vez de um `insert`, validando o primeiro acesso.
- Garantir que a lógica antiga de inserção para novos usuários continue funcionando.

**Non-Goals:**
- Adicionar autenticação complexa por e-mail, OAuth ou reset de senha via e-mail. A senha (PIN) continuará sendo um texto de 4 caracteres.
- Encriptação de senha via bcrypt neste momento (vamos manter a modelagem atual `pin text`).

## Decisions

1. **Alteração na aba ENTRAR:**
```tsx
if (fetchError || !data) {
  setError('Nome de guerra não encontrado ou PIN incorreto.');
} else if (data.pin === null) {
  setError('Sua conta ainda não possui senha. Por favor, vá em "Criar Conta" para definir seu PIN de acesso inicial.');
} else if (data.pin !== pin.trim()) {
  setError('Nome de guerra não encontrado ou PIN incorreto.');
} else {
  onLogin(data.id, normalizedName);
}
```

2. **Alteração na aba CRIAR:**
Antes do `.insert()`, rodaremos um `.select('id, pin').eq('nome_guerra', normalizedName).single()`.
- Se existir e tiver `pin`:
  `setError('Nome de Guerra já está em uso.');`
- Se existir e o `pin` for nulo:
  ```tsx
  const { error: updateError } = await supabase.from('usuarios').update({ pin: pin.trim() }).eq('id', existing.id);
  // handle error or onLogin(existing.id, normalizedName);
  ```
- Se não existir (`fetchError.code === 'PGRST116'`):
  Faz o `.insert([{ nome_guerra: normalizedName, pin: pin.trim() || null }])` tradicional.
