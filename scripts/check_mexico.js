import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkMexico() {
  const { data: users } = await supabase.from('usuarios').select('id, nome_guerra');
  
  const { data: jogos } = await supabase.from('jogos')
    .select('id, time_a, time_b, placar_oficial_a, placar_oficial_b')
    .eq('time_a', 'Mexico')
    .eq('time_b', 'South Africa');

  if (jogos.length > 0) {
    const game = jogos[0];
    console.log(`Jogo: Mexico x South Africa | Placar Oficial: ${game.placar_oficial_a} x ${game.placar_oficial_b}`);
    
    const { data: palpites } = await supabase.from('palpites').select('*').eq('jogo_id', game.id);
    
    for (const user of users) {
      const palpite = palpites.find(p => p.usuario_id === user.id);
      if (palpite) {
        console.log(`- ${user.nome_guerra}: ${palpite.palpite_a} a ${palpite.palpite_b}`);
      } else {
        console.log(`- ${user.nome_guerra}: Sem palpite`);
      }
    }
  } else {
    console.log('Jogo Mexico x South Africa não encontrado.');
  }
}

checkMexico();
