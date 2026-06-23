## Context

A lógica de cálculo no `automation_triggers.sql` estava dependendo exclusivamente da verificação `OLD.status IS DISTINCT FROM 'FINISHED'`. Em cenários de `INSERT` ou `UPSERT` onde o registro do jogo é criado com o status já `FINISHED`, a variável `OLD` inexiste, abortando a lógica no bloco `IF` antes que qualquer palpite pudesse ser pontuado. 

Isso causou pontos iguais a 0 e nulos para os jogos passados e os jogos recentes da Edge Function.

## Goals / Non-Goals

**Goals:**
- Ajustar a trigger em `automation_triggers.sql` para suportar `AFTER INSERT OR UPDATE`.
- Modificar o `WHEN` e o `IF` para lidar com a ausência de `OLD` nos `INSERT`s (utilizando uma lógica de coalesce ou alterando a restrição).
- Criar e rodar um `.sql` para recalcular retroativamente os pontos para os jogos que já estão lá (como o Excel e os jogos de ontem).

**Non-Goals:**
- Mudar as regras de pontuação base do Excel (+5, +2, +1). Apenas a forma como são disparadas será corrigida.

## Decisions

1. **Atualização da Trigger**:
O script será ajustado para remover `WHEN (OLD.status...)` da declaração do Trigger, transferindo a lógica para dentro da função. Na função, validaremos `IF NEW.status = 'FINISHED' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'FINISHED') THEN...`.

2. **Cálculo Retroativo**:
Vou montar uma migration SQL que simplesmente simulará a atualização de todos os jogos: `UPDATE public.jogos SET status = 'FINISHED' WHERE status = 'FINISHED'`. Com a trigger nova em ação para 'UPDATE', esse "fake update" fará com que o Supabase recalcule *todos os palpites* existentes de uma vez.
