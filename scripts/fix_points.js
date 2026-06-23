import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const targets = {
  'ENOS': 94,
  'GABRIEL': 106,
  'JAIRO': 90,
  'PAULO': 92,
  'THYAGO': 104
};

async function fixPoints() {
  console.log('Iniciando correção de pontos...');
  const { data: users, error } = await supabase
    .from('usuarios')
    .select('id, nome_guerra, pontos_legado, palpites(pontos_ganhos)');

  if (error) {
    console.error('Erro ao buscar usuários:', error.message);
    return;
  }

  for (const u of users) {
    const nome = u.nome_guerra.toUpperCase();
    const target = targets[nome];

    if (target !== undefined) {
      const sumGanhos = u.palpites ? u.palpites.reduce((a, b) => a + (b.pontos_ganhos || 0), 0) : 0;
      const novoLegado = target - sumGanhos;

      console.log(`[${nome}] Target PDF: ${target} | Sum Ganhos: ${sumGanhos} | Novo Legado: ${novoLegado}`);

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ pontos_legado: novoLegado })
        .eq('id', u.id);

      if (updateError) {
        console.error(`Erro ao atualizar ${nome}:`, updateError.message);
      } else {
        console.log(`✅ ${nome} atualizado com sucesso!`);
      }
    }
  }

  console.log('Correção finalizada!');
}

fixPoints();
