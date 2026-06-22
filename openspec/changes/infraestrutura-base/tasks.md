## 1. Banco de Dados Supabase (DDL)

- [ ] 1.1 Criar o script SQL de migração para a tabela `usuarios` (id, nome_guerra, pin, pontos_legado).
- [ ] 1.2 Criar o script SQL de migração para a tabela `jogos` (id, time_a, time_b, data_hora, placares_oficiais).
- [ ] 1.3 Criar o script SQL de migração para a tabela `palpites` (id, usuario_id, jogo_id, palpite_a, palpite_b, pontos_ganhos).
- [ ] 1.4 Adicionar a restrição UNIQUE `(usuario_id, jogo_id)` na tabela `palpites` no script SQL.

## 2. Motor de Pontuação (`scoreCalculator.ts`)

- [ ] 2.1 Criar o arquivo `src/utils/scoreCalculator.ts` e exportar os tipos de entrada e saída (ex: tipo do palpite e tipo do resultado oficial).
- [ ] 2.2 Implementar a regra de pontuação exata (+5 pontos).
- [ ] 2.3 Implementar a regra de diferença de gols e erro por apenas 1 gol (+2 pontos).
- [ ] 2.4 Implementar a regra de acerto de vencedor (+1 ponto cumulativo).
- [ ] 2.5 Implementar a exceção de anulação do bônus de vencedor (+1 ponto) quando o jogo for empate e o palpite não for o empate exato.
- [ ] 2.6 Opcional: Criar um caso de teste (script simples de verificação) em `scoreCalculator.test.ts` (ou equivalente) para garantir a funcionalidade correta das regras.
