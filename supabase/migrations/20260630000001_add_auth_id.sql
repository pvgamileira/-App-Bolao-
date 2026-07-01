-- ==========================================
-- Migração: Adiciona auth_id para Migração Progressiva
-- ==========================================

-- Adiciona a coluna auth_id na tabela usuarios para vincular o usuário do Supabase Auth ao registro legado
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;
