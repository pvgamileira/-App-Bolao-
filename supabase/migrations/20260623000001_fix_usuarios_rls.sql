-- Allow anonymous updates for usuarios (necessário para o Primeiro Acesso gravar a senha)
DROP POLICY IF EXISTS "Anonymous update for usuarios" ON public.usuarios;
CREATE POLICY "Anonymous update for usuarios" ON public.usuarios
    FOR UPDATE USING (true);
