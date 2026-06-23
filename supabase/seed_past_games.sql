-- Script para adicionar jogos iniciais da Copa (antes do dia 22/06)
-- Este script pode ser copiado e colado no SQL Editor do Supabase.

INSERT INTO public.jogos (time_a, time_b, data_hora, logo_a, logo_b, placar_oficial_a, placar_oficial_b, status)
VALUES
  ('México', 'Polônia', '2026-06-11T16:00:00Z', NULL, NULL, 1, 1, 'FINISHED'),
  ('Canadá', 'Senegal', '2026-06-12T16:00:00Z', NULL, NULL, 0, 2, 'FINISHED'),
  ('Estados Unidos', 'Irã', '2026-06-12T19:00:00Z', NULL, NULL, 2, 0, 'FINISHED'),
  ('Equador', 'Holanda', '2026-06-13T12:00:00Z', NULL, NULL, 1, 3, 'FINISHED'),
  ('Inglaterra', 'Croácia', '2026-06-14T15:00:00Z', NULL, NULL, 2, 1, 'FINISHED'),
  ('Espanha', 'Alemanha', '2026-06-15T18:00:00Z', NULL, NULL, 1, 1, 'FINISHED'),
  ('Brasil', 'Suíça', '2026-06-16T15:00:00Z', NULL, NULL, 1, 0, 'FINISHED'),
  ('Portugal', 'Uruguai', '2026-06-17T18:00:00Z', NULL, NULL, 2, 2, 'FINISHED'),
  ('Japão', 'Coreia do Sul', '2026-06-18T12:00:00Z', NULL, NULL, 0, 1, 'FINISHED'),
  ('França', 'Dinamarca', '2026-06-19T18:00:00Z', NULL, NULL, 3, 1, 'FINISHED'),
  ('Argentina', 'Arábia Saudita', '2026-06-20T12:00:00Z', NULL, NULL, 1, 2, 'FINISHED'),
  ('Bélgica', 'Canadá', '2026-06-21T18:00:00Z', NULL, NULL, 1, 0, 'FINISHED')
ON CONFLICT DO NOTHING;
