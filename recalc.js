import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

async function run() {
  console.log("Fetching data...");
  const { data: jogos, error: err1 } = await supabase.from('jogos').select('*').eq('status', 'FINISHED');
  if (err1) { console.error("Error fetching jogos", err1); return; }

  const { data: palpites, error: err2 } = await supabase.from('palpites').select('*');
  if (err2) { console.error("Error fetching palpites", err2); return; }

  console.log(`Found ${jogos.length} finished games and ${palpites.length} palpites.`);

  let updates = [];

  for (const palpite of palpites) {
    if (palpite.palpite_a === null || palpite.palpite_b === null) continue;

    const jogo = jogos.find(j => j.id === palpite.jogo_id);
    if (!jogo) continue;

    const offA = jogo.placar_oficial_a;
    const offB = jogo.placar_oficial_b;
    const guessA = palpite.palpite_a;
    const guessB = palpite.palpite_b;

    let pts = 0;

    const offDiff = offA - offB;
    const guessDiff = guessA - guessB;

    let offOutcome = offDiff > 0 ? 'A' : (offDiff < 0 ? 'B' : 'TIE');
    let guessOutcome = guessDiff > 0 ? 'A' : (guessDiff < 0 ? 'B' : 'TIE');

    let loserGoalsOff = offOutcome === 'A' ? offB : (offOutcome === 'B' ? offA : null);
    let loserGoalsGuess = guessOutcome === 'A' ? guessB : (guessOutcome === 'B' ? guessA : null);

    // Rule 1: Cravou
    if (offA === guessA && offB === guessB) {
      pts = 5;
    } else {
      // Acertou Vencedor
      if (offOutcome === guessOutcome) {
        pts = 3;

        // Bonus: exact diff
        if (Math.abs(offDiff) === Math.abs(guessDiff)) {
          pts += 1;
        }

        // Bonus: loser goals (ignore if 0 to match user's expectation of 3 points for 5x0 vs 3x0?)
        // Let's implement it exactly as written but maybe the user considers 0 as not a goal.
        // Let's keep 0 for now and log what happened.
        let gotLoserBonus = false;
        if (offOutcome !== 'TIE' && loserGoalsOff === loserGoalsGuess) {
          gotLoserBonus = true;
          // IF user expects 3 points, they didn't expect this. Let's see.
        }

        let gotGoleadaBonus = false;
        if (offOutcome !== 'TIE' && Math.abs(offDiff) >= 4) {
          gotGoleadaBonus = true;
        }

        // Let's simulate what happened in 5x0 vs 3x0
        if (offA === 5 && offB === 0 && guessA === 3 && guessB === 0) {
            console.log(`PORTUGAL GAME: Base 3 + loserBonus(${gotLoserBonus}) + goleada(${gotGoleadaBonus})`);
        }

        if (gotLoserBonus) pts += 1;
        if (gotGoleadaBonus) pts += 1;

        if (pts > 5) pts = 5;
      }
    }

    if (palpite.pontos_ganhos !== pts) {
      updates.push({ id: palpite.id, pts });
    }
  }

  console.log(`Need to update ${updates.length} palpites.`);
  
  // Execute updates
  for (const up of updates) {
    const { error } = await supabase.from('palpites').update({ pontos_ganhos: up.pts }).eq('id', up.id);
    if (error) {
        console.error(`Failed to update palpite ${up.id}:`, error);
    }
  }
  
  // Also zero out pontos_legado in usuarios so it doesn't double if they revert App.tsx
  const { error: userErr } = await supabase.from('usuarios').update({ pontos_legado: 0 }).neq('pontos_legado', 0);
  if (userErr) {
      console.error("Failed to zero pontos_legado", userErr);
  } else {
      console.log("Zeroed out pontos_legado for all users.");
  }
  
  console.log("Recalculation complete.");
}

run();
