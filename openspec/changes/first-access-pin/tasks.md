## 1. Atualizar fluxo de Login (ENTRAR)
- [x] 1.1 Em `AuthForm.tsx` (handleSubmit), modificar a validação da aba `ENTRAR` para verificar explicitamente se `data.pin === null`.
- [x] 1.2 Em `AuthForm.tsx` (handleSubmit), definir `setError` com a instrução de "Primeiro Acesso" se o `pin` for nulo.

## 2. Atualizar fluxo de Cadastro (CRIAR)
- [x] 2.1 Em `AuthForm.tsx` (handleSubmit), no bloco da aba `CRIAR`, substituir o `.insert` direto por um `.select('id, pin').eq('nome_guerra', normalizedName).single()`.
- [x] 2.2 Tratar o retorno: Se o erro for `PGRST116` (Não encontrado), realizar o `insert` do novo usuário.
- [x] 2.3 Tratar o retorno: Se encontrou o usuário e `data.pin !== null`, exibir erro "Nome de Guerra já está em uso".
- [x] 2.4 Tratar o retorno: Se encontrou o usuário e `data.pin === null`, executar `.update({ pin: pin.trim() }).eq('id', data.id)` para definir a senha do primeiro acesso.
- [x] 2.5 Lidar com logins automáticos logo após o sucesso da operação (insert ou update).
