import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listGames() {
  const { data: jogos, error } = await supabase.from('jogos')
    .select('id, time_a, time_b, data_hora')
    .order('data_hora', { ascending: true })
    .limit(100);

  if (error) {
    console.error(error);
  } else {
    console.log(jogos.map(j => `${j.time_a} x ${j.time_b} (${j.data_hora})`).join('\n'));
  }
}

listGames();
