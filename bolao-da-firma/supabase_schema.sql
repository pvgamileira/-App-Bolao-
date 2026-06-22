-- Create 'usuarios' table
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_guerra VARCHAR NOT NULL UNIQUE,
    pin VARCHAR(4),
    pontos_legado INT DEFAULT 0
);

-- Create 'jogos' table
CREATE TABLE IF NOT EXISTS public.jogos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_a VARCHAR NOT NULL,
    time_b VARCHAR NOT NULL,
    data_hora TIMESTAMPTZ NOT NULL,
    placar_oficial_a INT,
    placar_oficial_b INT
);

-- Create 'palpites' table
CREATE TABLE IF NOT EXISTS public.palpites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    jogo_id UUID NOT NULL REFERENCES public.jogos(id) ON DELETE CASCADE,
    palpite_a INT NOT NULL,
    palpite_b INT NOT NULL,
    pontos_ganhos INT,
    CONSTRAINT unique_palpite_usuario_jogo UNIQUE (usuario_id, jogo_id)
);

-- Enable Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.palpites ENABLE ROW LEVEL SECURITY;

-- Policies for 'usuarios'
-- Allow public read access (needed for leaderboard and login check)
CREATE POLICY "Public read access for usuarios" ON public.usuarios
    FOR SELECT USING (true);

-- Allow anonymous inserts (for frictionless login/registration)
CREATE POLICY "Anonymous insert for usuarios" ON public.usuarios
    FOR INSERT WITH CHECK (true);

-- Policies for 'jogos'
-- Allow public read access (to show daily matches)
CREATE POLICY "Public read access for jogos" ON public.jogos
    FOR SELECT USING (true);

-- Policies for 'palpites'
-- Allow public read access (for leaderboard stats if needed)
CREATE POLICY "Public read access for palpites" ON public.palpites
    FOR SELECT USING (true);

-- Allow anonymous inserts (since we aren't using strict auth, we allow inserts,
-- but the unique constraint will prevent multiple guesses from same user per match)
CREATE POLICY "Anonymous insert for palpites" ON public.palpites
    FOR INSERT WITH CHECK (true);

-- Allow anonymous updates (users can update their guesses before the match starts)
-- In a real app we'd check if the match hasn't started, but keeping it simple for frictionless
CREATE POLICY "Anonymous update for palpites" ON public.palpites
    FOR UPDATE USING (true);

wWbkkytYQExYw0aF