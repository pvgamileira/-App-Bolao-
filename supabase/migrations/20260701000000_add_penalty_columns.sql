-- ==========================================
-- Migração: Suporte para Prorrogação e Pênaltis
-- ==========================================

ALTER TABLE public.jogos 
ADD COLUMN IF NOT EXISTS foi_para_prorogacao BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS foi_para_penaltis BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS vencedor_penaltis VARCHAR(1) DEFAULT NULL;
