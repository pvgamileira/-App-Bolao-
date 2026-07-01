## Context

O Bolão da Firma atualmente assume que os jogos terminam em vitória de um dos times ou em empate, baseando-se unicamente nos campos `placar_oficial_a` e `placar_oficial_b`. Com a chegada da fase eliminatória da Copa, empates nos 120 minutos (tempo normal + prorrogação) são decididos nos pênaltis. Precisamos de uma forma de exibir isso na UI e registrar no banco sem quebrar a lógica atual de palpites, que se baseia apenas em saldo de gols para gerar pontos.

## Goals / Non-Goals

**Goals:**
- Permitir que o administrador registre se um jogo foi para a prorrogação e/ou pênaltis.
- Permitir que o administrador informe qual time venceu os pênaltis.
- Refletir essas informações na UI de listagem de jogos (badges visuais).
- Garantir que a trigger de pontuação (`update_user_points_on_match_finish`) não quebre com essas novas colunas.

**Non-Goals:**
- Não vamos criar palpites separados para placar de pênaltis. Os palpites dos usuários continuam sendo apenas para o placar final (incluindo prorrogação).
- Não mudaremos as regras de pontuação baseadas no vencedor dos pênaltis. A regra do bolão diz que os pontos são calculados em cima dos gols (empate é empate, independente de quem ganha nos pênaltis). O vencedor dos pênaltis é apenas visual e informativo para o ranking/chaveamento.

## Decisions

1. **Adição de novas colunas booleanas em `public.jogos`:**
   - `foi_para_prorogacao` (BOOLEAN DEFAULT FALSE)
   - `foi_para_penaltis` (BOOLEAN DEFAULT FALSE)
   - `vencedor_penaltis` (VARCHAR(1) DEFAULT NULL) - Aceitará 'A' ou 'B'.
   - *Rationale:* Facilita o consumo pelo frontend. Um simples `if (jogo.foi_para_penaltis)` pode renderizar o badge de pênaltis e destacar o time de acordo com `vencedor_penaltis`.
2. **Atualização do Frontend (`MatchList` / `MatchCard`):**
   - Renderizaremos badges verdes/amarelos dizendo "Prorrogação" ou "Pênaltis".
   - Ao lado do placar do time que venceu os pênaltis, podemos adicionar um ícone de "check" ou um badge "(P)".

## Risks / Trade-offs

- **[Risco] O administrador pode preencher dados conflitantes** → (Ex: Jogo não empatou, mas ele marcou `foi_para_penaltis = true`).
  - *Mitigação*: O painel de admin (ou as queries de update) deverão validar que `vencedor_penaltis` só pode ser preenchido se os placares forem iguais.
