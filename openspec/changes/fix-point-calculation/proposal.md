## Why

Atualmente, todos os usuários estão com `0 pontos` no ranking para os jogos passados. A análise revelou que os palpites no banco de dados estão corretos, mas a coluna `pontos_ganhos` não está sendo calculada para jogos passados trazidos da API da ESPN.

O problema ocorre por dois motivos:
1. O trigger do Supabase responsável por calcular os pontos (`trigger_update_points`) está configurado apenas para `AFTER UPDATE ON public.jogos WHEN (OLD.status IS DISTINCT FROM 'FINISHED' AND NEW.status = 'FINISHED')`.
2. Como a função de sincronização usa `upsert` e insere jogos pregressos com o status `FINISHED` diretamente (INSERT), o `OLD.status` não existe, fazendo com que o trigger não dispare para inserts de jogos passados, além de não rodar para cálculos retroativos em massa.

Precisamos alterar o trigger para suportar `INSERT OR UPDATE` e rodar um script SQL corretivo que recalcule os pontos dos palpites baseados no Excel e nos jogos de ontem, preenchendo todos os `pontos_ganhos` que estão `null`.

## What Changes

1. **Trigger de Pontuação:** Modificar `trigger_update_points` para disparar tanto em `INSERT` quanto `UPDATE`.
2. **Lógica da Trigger (Prevenção de Erros):** Usar `COALESCE(OLD.status, '')` para evitar falhas silenciosas quando o `OLD` for nulo no caso de um `INSERT`.
3. **Script de Correção (Retroativo):** Uma migration SQL que percorre todos os jogos já finalizados e recalcula os pontos dos palpites vinculados a eles.

## Capabilities

### New Capabilities
- Nenhuma.

### Modified Capabilities
- **Pontuação / Ranking (`pontuacao-automatica`)**: A pontuação passará a ser reavaliada mesmo quando os dados forem inseridos pela Edge Function como já `FINISHED`, sincronizando instantaneamente a tabela de liderança.

## Impact
- Afeta o ranking de todos os usuários. Assim que for feito o deploy desse SQL, a tabela do Frontend passará a refletir a soma real dos pontos no formato validado pelo Excel.
