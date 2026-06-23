import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  // 1. Get users
  const { data: users } = await supabase.from('usuarios').select('id, nome_guerra');
  const userMap = {};
  users.forEach(u => userMap[u.nome_guerra] = u.id);

  // 2. Get specific games
  const { data: jogos } = await supabase.from('jogos')
    .select('id, time_a, time_b, placar_oficial_a, placar_oficial_b');

  const targetGames = [
    { a: 'Argentina', b: 'Austria' },
    { a: 'France', b: 'Iraq' },
    { a: 'Norway', b: 'Senegal' },
    { a: 'Jordan', b: 'Algeria' }
  ];

  const gamesMap = {};
  for (const t of targetGames) {
    const game = jogos.find(j => j.time_a === t.a && j.time_b === t.b);
    if (game) {
      gamesMap[`${t.a} X ${t.b}`] = game;
    } else {
      console.log(`Jogo não encontrado: ${t.a} x ${t.b}`);
    }
  }

  // 3. Get guesses for these games
  for (const [title, game] of Object.entries(gamesMap)) {
    console.log(`\n=================================`);
    console.log(`Verificando Jogo: ${title}`);
    console.log(`Placar Oficial (se houver): ${game.placar_oficial_a} x ${game.placar_oficial_b}`);

    const { data: palpites } = await supabase.from('palpites').select('*').eq('jogo_id', game.id);

    for (const user of users) {
      const palpite = palpites.find(p => p.usuario_id === user.id);
      if (palpite) {
        console.log(`- ${user.nome_guerra}: ${palpite.palpite_a} a ${palpite.palpite_b} (Pontos: ${palpite.pontos || 0})`);
      } else {
        console.log(`- ${user.nome_guerra}: Sem palpite`);
      }
    }
  }

  // 4. Check leaderboard
  console.log(`\n=================================`);
  console.log(`RANKING:`);
  users.sort((a, b) => (b.pontuacao_total || 0) - (a.pontuacao_total || 0));
  for (const u of users) {
    console.log(`${u.nome_guerra}: ${u.pontuacao_total || 0} pontos`);
  }
}

check();
