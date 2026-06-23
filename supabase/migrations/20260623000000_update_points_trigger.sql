-- 1.1 Add 'status' column to 'jogos'
ALTER TABLE public.jogos 
ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'SCHEDULED';

-- 1.2 Implement the scoring logic in a PL/pgSQL function
CREATE OR REPLACE FUNCTION update_user_points_on_match_finish()
RETURNS TRIGGER AS $$
DECLARE
    palpite_row RECORD;
    pts INT;
    official_diff INT;
    guess_diff INT;
    official_outcome VARCHAR;
    guess_outcome VARCHAR;
    is_exact_diff BOOLEAN;
    is_missed_by_one BOOLEAN;
BEGIN
    IF NEW.status = 'FINISHED' AND (
        TG_OP = 'INSERT' OR 
        OLD.status IS DISTINCT FROM 'FINISHED' OR
        NEW.placar_oficial_a IS DISTINCT FROM OLD.placar_oficial_a OR
        NEW.placar_oficial_b IS DISTINCT FROM OLD.placar_oficial_b
    ) THEN
        
        -- Pre-calculate official differences and outcomes
        official_diff := NEW.placar_oficial_a - NEW.placar_oficial_b;
        IF official_diff > 0 THEN
            official_outcome := 'A_WIN';
        ELSIF official_diff < 0 THEN
            official_outcome := 'B_WIN';
        ELSE
            official_outcome := 'TIE';
        END IF;

        -- Loop through all palpites for this jogo
        FOR palpite_row IN SELECT * FROM public.palpites WHERE jogo_id = NEW.id LOOP
            pts := 0;
            
            -- Rule 1: Exact Score (+5)
            IF palpite_row.palpite_a = NEW.placar_oficial_a AND palpite_row.palpite_b = NEW.placar_oficial_b THEN
                pts := 5;
            ELSE
                -- Calculate guess differences and outcomes
                guess_diff := palpite_row.palpite_a - palpite_row.palpite_b;
                IF guess_diff > 0 THEN
                    guess_outcome := 'A_WIN';
                ELSIF guess_diff < 0 THEN
                    guess_outcome := 'B_WIN';
                ELSE
                    guess_outcome := 'TIE';
                END IF;

                -- Rule 3 & 4: Trend (+1) and Tie Exception
                IF official_outcome = guess_outcome AND official_outcome != 'TIE' THEN
                    pts := pts + 1;
                END IF;

                -- Rule 2: Approximate (+2)
                is_exact_diff := (official_diff = guess_diff);
                is_missed_by_one := (
                    (abs(palpite_row.palpite_a - NEW.placar_oficial_a) = 1 AND palpite_row.palpite_b = NEW.placar_oficial_b) OR
                    (abs(palpite_row.palpite_b - NEW.placar_oficial_b) = 1 AND palpite_row.palpite_a = NEW.placar_oficial_a)
                );

                IF is_exact_diff OR is_missed_by_one THEN
                    pts := pts + 2;
                END IF;
            END IF;

            -- Update the points won for this palpite
            UPDATE public.palpites 
            SET pontos_ganhos = pts 
            WHERE id = palpite_row.id;

        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1.3 Attach the trigger
DROP TRIGGER IF EXISTS trigger_update_points ON public.jogos;

CREATE TRIGGER trigger_update_points
AFTER INSERT OR UPDATE ON public.jogos
FOR EACH ROW
EXECUTE FUNCTION update_user_points_on_match_finish();

-- 1.4 Dummy update to force recalculation of existing points
UPDATE public.jogos SET status = 'PENDING_RECALC' WHERE status = 'FINISHED';
UPDATE public.jogos SET status = 'FINISHED' WHERE status = 'PENDING_RECALC';
