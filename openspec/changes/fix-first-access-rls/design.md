## Context
O arquivo `supabase_schema.sql` atual ativa o RLS para a tabela `usuarios`, fornecendo apenas permissões de `SELECT` e `INSERT` anônimos para suportar o fluxo frictionless da aplicação, mas faltou a permissão de `UPDATE`. Sem o `UPDATE`, o código de resgate de conta não consegue gravar a nova senha.

## Goals / Non-Goals
**Goals:**
- Adicionar política de UPDATE na tabela `usuarios`.
- Garantir que a alteração seja feita via script SQL, passível de execução direta no Supabase.

**Non-Goals:**
- Alterar o frontend (já fizemos isso na feature anterior e a parte visual está certa).

## Decisions
1. Vamos criar um novo arquivo `.sql` contendo o código para criar a policy (ou pedir para o usuário colar lá no SQL Editor).
2. O código SQL será:
   ```sql
   -- Allow anonymous updates for usuarios (necessário para o "Primeiro Acesso")
   CREATE POLICY "Anonymous update for usuarios" ON public.usuarios
       FOR UPDATE USING (true);
   ```
3. Também atualizaremos o arquivo base `supabase_schema.sql` do repositório para deixar registrado caso o banco seja recriado do zero.
