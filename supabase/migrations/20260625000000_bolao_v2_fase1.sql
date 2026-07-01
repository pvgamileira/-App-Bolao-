-- ==========================================
-- FASE 1: O Alicerce Oculto (Multi-tenant)
-- ==========================================

-- 1. Criação das Tabelas Base

-- Tabela de Ligas (O Grupo)
CREATE TABLE public.ligas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    codigo_convite TEXT UNIQUE NOT NULL,
    criador_id UUID REFERENCES public.usuarios(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela Associativa: Membros da Liga (N:N)
CREATE TABLE public.membros_liga (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
    liga_id UUID REFERENCES public.ligas(id) ON DELETE CASCADE NOT NULL,
    saldo_pontos INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(usuario_id, liga_id) -- Um usuário não pode entrar 2x na mesma liga
);

-- ==========================================
-- 2. Segurança: Row Level Security (RLS)
-- ==========================================

-- NOTA: O Bolão da Firma utiliza um sistema customizado de Auth na tabela `usuarios`.
-- Por isso, as funções nativas como `auth.uid()` não funcionam e quebraríam as queries.
-- Para a Fase 1, deixaremos essas novas tabelas acessíveis publicamente (já que o frontend não as acessa de forma perigosa ainda).
-- Nas fases seguintes, a segurança será reforçada via Edge Functions ou lógicas customizadas.

-- ALTER TABLE public.ligas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.membros_liga ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. A Grande Migração Invisível (Zero Downtime)
-- ==========================================

DO $$
DECLARE
    admin_id UUID;
    nova_liga_id UUID;
BEGIN
    -- 1. Pega o ID de algum usuário atual para ser o "Dono/Criador" da Liga Oficial (Puxando da sua tabela customizada)
    SELECT id INTO admin_id FROM public.usuarios LIMIT 1;
    
    -- Só cria se existir algum usuário (para evitar erro de null se o DB estiver vazio)
    IF admin_id IS NOT NULL THEN
        -- 2. Cria a Liga Oficial do Bolão da Firma
        INSERT INTO public.ligas (nome, codigo_convite, criador_id)
        VALUES ('Bolão Oficial', 'BOLAO_OFICIAL', admin_id)
        RETURNING id INTO nova_liga_id;

        -- 3. Insere TODOS os usuários atualmente cadastrados como membros desta Liga Oficial
        INSERT INTO public.membros_liga (usuario_id, liga_id, saldo_pontos)
        SELECT u.id, nova_liga_id, COALESCE(u.pontos_legado, 0)
        FROM public.usuarios u;
    END IF;

END $$;
