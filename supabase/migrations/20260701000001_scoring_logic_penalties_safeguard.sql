CREATE OR REPLACE FUNCTION update_user_points_on_match_finish()
RETURNS TRIGGER AS $$
DECLARE
    palpite_row RECORD;
    pts INT;
    official_diff INT;
    guess_diff INT;
    official_outcome VARCHAR;
    guess_outcome VARCHAR;
    loser_goals_official INT;
    loser_goals_guess INT;
BEGIN
    IF NEW.status = 'FINISHED' AND (
        TG_OP = 'INSERT' OR 
        OLD.status IS DISTINCT FROM 'FINISHED' OR
        NEW.placar_oficial_a IS DISTINCT FROM OLD.placar_oficial_a OR
        NEW.placar_oficial_b IS DISTINCT FROM OLD.placar_oficial_b
    ) THEN
        
        -- SAFEGUARD: O bolão utiliza os gols oficiais marcados nos 90/120 minutos (tempo normal/prorrogação).
        -- Caso a partida vá para os pênaltis, os gols de pênaltis não devem ser somados nestas colunas.
        -- O cálculo sempre dependerá de placar_oficial_a e placar_oficial_b, independente das flags de pênalti.

        -- Pre-calculate official differences and outcomes
        official_diff := NEW.placar_oficial_a - NEW.placar_oficial_b;
        IF official_diff > 0 THEN
            official_outcome := 'A_WIN';
            loser_goals_official := NEW.placar_oficial_b;
        ELSIF official_diff < 0 THEN
            official_outcome := 'B_WIN';
            loser_goals_official := NEW.placar_oficial_a;
        ELSE
            official_outcome := 'TIE';
            loser_goals_official := NULL;
        END IF;

        -- Loop through all palpites for this jogo
        FOR palpite_row IN SELECT * FROM public.palpites WHERE jogo_id = NEW.id LOOP
            pts := 0;
            
            -- Only process if palpite is not null
            IF palpite_row.palpite_a IS NOT NULL AND palpite_row.palpite_b IS NOT NULL THEN
            
                -- Rule 1: Exact Score (+5)
                IF palpite_row.palpite_a = NEW.placar_oficial_a AND palpite_row.palpite_b = NEW.placar_oficial_b THEN
                    pts := 5;
                ELSE
                    -- Calculate guess differences and outcomes
                    guess_diff := palpite_row.palpite_a - palpite_row.palpite_b;
                    IF guess_diff > 0 THEN
                        guess_outcome := 'A_WIN';
                        loser_goals_guess := palpite_row.palpite_b;
                    ELSIF guess_diff < 0 THEN
                        guess_outcome := 'B_WIN';
                        loser_goals_guess := palpite_row.palpite_a;
                    ELSE
                        guess_outcome := 'TIE';
                        loser_goals_guess := NULL;
                    END IF;

                    -- Base Rule 2: Winner/Tie (+3)
                    IF official_outcome = guess_outcome THEN
                        pts := 3;
                        
                        -- Bonus: Exact Goal Difference (+1)
                        IF abs(official_diff) = abs(guess_diff) THEN
                            pts := pts + 1;
                        END IF;
                        
                        -- Bonus: Exact Loser Goals (+1) (Only if not a tie)
                        IF official_outcome != 'TIE' AND loser_goals_official = loser_goals_guess THEN
                            pts := pts + 1;
                        END IF;
                        
                        -- Bonus: Blowout (+1) (Goal diff >= 4)
                        IF official_outcome != 'TIE' AND abs(official_diff) >= 4 THEN
                            pts := pts + 1;
                        END IF;
                        
                        -- Enforce Maximum Points Cap (5)
                        pts := LEAST(pts, 5);
                    END IF;
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

-- Dummy update to force recalculation of existing points for old matches
UPDATE public.jogos SET status = 'PENDING_RECALC' WHERE status = 'FINISHED';
UPDATE public.jogos SET status = 'FINISHED' WHERE status = 'PENDING_RECALC';
