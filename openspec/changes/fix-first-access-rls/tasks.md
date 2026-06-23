## 1. Atualizar arquivo base do repositório
- [x] 1.1 Em `supabase_schema.sql`, adicionar o trecho `CREATE POLICY "Anonymous update for usuarios" ON public.usuarios FOR UPDATE USING (true);`.

## 2. Criar script de migração
- [x] 2.1 Criar o arquivo `supabase/migrations/20260623000001_fix_usuarios_rls.sql` contendo o código SQL de criação da Policy.
- [x] 2.2 Instruir o usuário a rodar esse código no SQL Editor do Supabase Dashboard.
