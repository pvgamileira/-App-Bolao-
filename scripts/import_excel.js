import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const teamNameMap = {
  "Africa do Sul": "South Africa",
  "Coreia do Sul": "South Korea",
  "República Tcheca": "Czechia",
  "Canadá": "Canada",
  "Bósnia": "Bosnia-Herzegovina",
  "EUA": "United States",
  "Paraguai": "Paraguay",
  "Catar": "Qatar",
  "Suíça": "Switzerland",
  "Brasil": "Brazil",
  "Marrocos": "Morocco",
  "Haiti": "Haiti",
  "Escócia": "Scotland",
  "Australia": "Australia",
  "Turquia": "Türkiye",
  "Alemanha": "Germany",
  "Curaçau": "Curaçao",
  "Holanda": "Netherlands",
  "Japão": "Japan",
  "Costa do Marfim": "Ivory Coast",
  "Equador": "Ecuador",
  "Suécia": "Sweden",
  "Tunísia": "Tunisia",
  "Espanha": "Spain",
  "Cabo Verde": "Cape Verde",
  "Bélgica": "Belgium",
  "Egito": "Egypt",
  "Arábia Saudita": "Saudi Arabia",
  "Uruguai": "Uruguay",
  "Irã": "Iran",
  "Nova Zelândia": "New Zealand",
  "França": "France",
  "Senegal": "Senegal",
  "Iraque": "Iraq",
  "Noruega": "Norway",
  "Argentina": "Argentina",
  "Argelia": "Algeria",
  "Austria": "Austria",
  "Jordania": "Jordan",
  "Portugal": "Portugal",
  "RD Congo": "Congo DR",
  "Inglaterra": "England",
  "Croácia": "Croatia",
  "Gana": "Ghana",
  "Panamá": "Panama",
  "Uzbequistão": "Uzbekistan",
  "Colômbia": "Colombia",
  "Mexico": "Mexico"
};

const normalizeTeamName = (name) => {
  if (!name) return name;
  const trimmed = name.trim();
  return teamNameMap[trimmed] || trimmed;
};

async function importExcel() {
  const filePath = path.resolve(__dirname, '../Palpites da Copa1.xlsx');
  console.log(`Lendo arquivo: ${filePath}`);
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  // Pega usuários do banco
  const { data: users } = await supabase.from('usuarios').select('id, nome_guerra');
  const userMap = {};
  users.forEach(u => userMap[u.nome_guerra.toUpperCase()] = u.id);

  // Mapeamento de colunas do Excel para usuários
  // Row 2 tem os headers: "Enos", "Gabriel", "Jairo", "Paulo", "Thyago"
  const colMap = [
    { name: 'ENOS', colA: 5, colB: 6 },
    { name: 'GABRIEL', colA: 7, colB: 8 },
    { name: 'JAIRO', colA: 9, colB: 10 },
    { name: 'PAULO', colA: 11, colB: 12 },
    { name: 'THYAGO', colA: 13, colB: 14 }
  ];

  // Pega todos os jogos do banco
  const { data: jogos } = await supabase.from('jogos').select('id, time_a, time_b');
  
  let inserts = [];
  
  // Começa a ler da linha 3 (index 3) pra baixo
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 5) continue; // Pula linhas vazias
    
    const teamAOrig = row[1];
    const teamBOrig = row[4];
    
    if (!teamAOrig || !teamBOrig || typeof teamAOrig !== 'string') continue;
    
    const teamA = normalizeTeamName(teamAOrig);
    const teamB = normalizeTeamName(teamBOrig);
    
    const dbGame = jogos.find(j => j.time_a === teamA && j.time_b === teamB);
    
    if (!dbGame) {
      console.warn(`[!] Jogo não encontrado no banco: ${teamA} x ${teamB} (Original: ${teamAOrig} x ${teamBOrig})`);
      continue;
    }
    
    // Para cada usuário, pega o palpite
    for (const uInfo of colMap) {
      const palpiteA = row[uInfo.colA];
      const palpiteB = row[uInfo.colB];
      
      // Se tiver palpite válido
      if (palpiteA !== undefined && palpiteA !== null && palpiteB !== undefined && palpiteB !== null && typeof palpiteA === 'number') {
        const userId = userMap[uInfo.name];
        if (userId) {
          inserts.push({
            jogo_id: dbGame.id,
            usuario_id: userId,
            palpite_a: palpiteA,
            palpite_b: palpiteB
          });
        }
      }
    }
  }

  console.log(`Encontrados ${inserts.length} palpites para importar.`);
  
  if (inserts.length > 0) {
    const { error } = await supabase.from('palpites').upsert(inserts, { onConflict: 'jogo_id,usuario_id' });
    if (error) {
      console.error('Erro ao importar palpites:', error.message);
    } else {
      console.log('Importação concluída com sucesso!');
    }
  }
}

importExcel();
