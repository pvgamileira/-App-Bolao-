/**
 * sync_legacy_points.cjs
 * 
 * One-time script to reconcile the `pontos_legado` column in the `usuarios` table
 * against the official PDF target values, scoped to a cutoff date (2026-06-22).
 * 
 * Formula: pontos_legado = PDF_target - sum(pontos_ganhos for matches on or before cutoff)
 * 
 * Uses native fetch API (no @supabase/supabase-js) to avoid Node 20 WebSocket issues.
 */

const fs = require('fs');

// --- Configuration ---
const CUTOFF_DATE = '2026-06-22T23:59:59Z';

const PDF_TARGETS = {
  'ENOS': 94,
  'GABRIEL': 106,
  'JAIRO': 90,
  'PAULO': 92,
  'THYAGO': 104
};

// --- Read env vars ---
const env = fs.readFileSync('.env.local', 'utf8');
let supabaseUrl = '';
let supabaseKey = '';

env.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=').slice(1).join('=').trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=').slice(1).join('=').trim();
});

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Could not read VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY from .env.local');
  process.exit(1);
}

const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

async function main() {
  console.log('=== Legacy Points Sync Script ===');
  console.log(`Cutoff date: ${CUTOFF_DATE}`);
  console.log(`PDF targets: ${JSON.stringify(PDF_TARGETS)}\n`);

  // --- Step 1: Fetch all users ---
  console.log('Fetching users...');
  const resUsers = await fetch(
    `${supabaseUrl}/rest/v1/usuarios?select=id,nome_guerra`,
    { headers }
  );
  const users = await resUsers.json();
  if (!Array.isArray(users)) {
    console.error('ERROR fetching users:', users);
    process.exit(1);
  }
  console.log(`Found ${users.length} users.\n`);

  // --- Step 2: Fetch all palpites joined with jogos ---
  console.log('Fetching palpites with jogos...');
  const resPalpites = await fetch(
    `${supabaseUrl}/rest/v1/palpites?select=usuario_id,pontos_ganhos,jogos(data_hora)`,
    { headers }
  );
  const palpites = await resPalpites.json();
  if (!Array.isArray(palpites)) {
    console.error('ERROR fetching palpites:', palpites);
    process.exit(1);
  }
  console.log(`Found ${palpites.length} palpites.\n`);

  // --- Step 3: Sum pontos_ganhos per user for pre-cutoff matches only ---
  const preCutoffSums = {};
  const totalSums = {};
  
  for (const p of palpites) {
    const uid = p.usuario_id;
    const pts = p.pontos_ganhos || 0;
    
    // Total sum (all matches)
    totalSums[uid] = (totalSums[uid] || 0) + pts;

    // Pre-cutoff sum
    if (p.jogos && p.jogos.data_hora && new Date(p.jogos.data_hora) <= new Date(CUTOFF_DATE)) {
      preCutoffSums[uid] = (preCutoffSums[uid] || 0) + pts;
    }
  }

  // --- Step 4: Calculate pontos_legado and update ---
  console.log('Calculating legacy points...\n');
  
  const results = [];

  for (const user of users) {
    const nome = user.nome_guerra.toUpperCase();
    const target = PDF_TARGETS[nome];

    if (target === undefined) {
      console.log(`SKIP: ${user.nome_guerra} (no PDF target defined)`);
      continue;
    }

    const preCutoffSum = preCutoffSums[user.id] || 0;
    const totalSum = totalSums[user.id] || 0;
    const legado = target - preCutoffSum;
    const expectedTotal = legado + totalSum;

    if (legado < 0) {
      console.warn(`⚠️  WARNING: ${nome} has NEGATIVE legacy (${legado}). PDF target ${target} < pre-cutoff sum ${preCutoffSum}. The PDF may have under-counted.`);
    }

    // PATCH the user's pontos_legado
    const patchRes = await fetch(
      `${supabaseUrl}/rest/v1/usuarios?id=eq.${user.id}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ pontos_legado: legado })
      }
    );

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.error(`ERROR updating ${nome}: ${patchRes.status} ${errText}`);
      continue;
    }

    results.push({
      nome,
      pdfTarget: target,
      preCutoffSum,
      legado,
      totalGanhos: totalSum,
      expectedTotal
    });

    console.log(`✅ ${nome}: Updated pontos_legado = ${legado}`);
  }

  // --- Step 5: Print summary table ---
  console.log('\n=== SUMMARY TABLE ===');
  console.log('─'.repeat(85));
  console.log(
    'User'.padEnd(12) +
    'PDF Target'.padEnd(14) +
    'Pre-Cutoff Sum'.padEnd(18) +
    'Legado'.padEnd(10) +
    'All Ganhos'.padEnd(14) +
    'Expected Total'
  );
  console.log('─'.repeat(85));

  for (const r of results) {
    console.log(
      r.nome.padEnd(12) +
      String(r.pdfTarget).padEnd(14) +
      String(r.preCutoffSum).padEnd(18) +
      String(r.legado).padEnd(10) +
      String(r.totalGanhos).padEnd(14) +
      String(r.expectedTotal)
    );
  }
  console.log('─'.repeat(85));
  console.log('\nDone! The frontend will now show: pontos_legado + sum(all pontos_ganhos) = correct total.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
