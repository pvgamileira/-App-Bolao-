-- Allow anonymous updates for usuarios (necessário para o Primeiro Acesso gravar a senha)
CREATE POLICY "Anonymous update for usuarios" ON public.usuarios
    FOR UPDATE USING (true);
