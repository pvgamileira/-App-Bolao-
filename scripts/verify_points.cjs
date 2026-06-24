const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
let supabaseUrl = '';
let supabaseKey = '';

env.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
};

async function checkPoints() {
    console.log("Fetching users...");
    const resUsers = await fetch(`${supabaseUrl}/rest/v1/usuarios?select=id,nome_guerra,pontos_legado`, { headers });
    const users = await resUsers.json();
    if (users.error) return console.error(users.error);

    console.log("Fetching palpites and jogos...");
    const resPalpites = await fetch(`${supabaseUrl}/rest/v1/palpites?select=id,usuario_id,jogo_id,palpite_a,palpite_b,pontos_ganhos,jogos(id,time_a,time_b,placar_oficial_a,placar_oficial_b,status,data_hora)`, { headers });
    const palpites = await resPalpites.json();
    if (palpites.error) return console.error(palpites.error);

    const userPoints = {};
    users.forEach(u => {
        userPoints[u.id] = {
            nome: u.nome_guerra,
            legado: u.pontos_legado || 0,
            ganhos: 0,
            total: u.pontos_legado || 0
        };
    });

    let mismatchCount = 0;

    for (const p of palpites) {
        if (!p.jogos || p.jogos.status !== 'FINISHED') continue;
        
        let calculatedPts = 0;
        
        if (p.palpite_a !== null && p.palpite_b !== null && p.jogos.placar_oficial_a !== null && p.jogos.placar_oficial_b !== null) {
            const officialDiff = p.jogos.placar_oficial_a - p.jogos.placar_oficial_b;
            const guessDiff = p.palpite_a - p.palpite_b;
            
            let officialOutcome = officialDiff > 0 ? 'A' : (officialDiff < 0 ? 'B' : 'TIE');
            let guessOutcome = guessDiff > 0 ? 'A' : (guessDiff < 0 ? 'B' : 'TIE');
            
            let loserGoalsOfficial = officialOutcome === 'A' ? p.jogos.placar_oficial_b : (officialOutcome === 'B' ? p.jogos.placar_oficial_a : null);
            let loserGoalsGuess = guessOutcome === 'A' ? p.palpite_b : (guessOutcome === 'B' ? p.palpite_a : null);

            if (p.palpite_a === p.jogos.placar_oficial_a && p.palpite_b === p.jogos.placar_oficial_b) {
                calculatedPts = 5;
            } else {
                if (officialOutcome === guessOutcome) {
                    calculatedPts = 3;
                    if (Math.abs(officialDiff) === Math.abs(guessDiff)) calculatedPts += 1;
                    if (officialOutcome !== 'TIE' && loserGoalsOfficial === loserGoalsGuess) calculatedPts += 1;
                    if (officialOutcome !== 'TIE' && Math.abs(officialDiff) >= 4) calculatedPts += 1;
                    calculatedPts = Math.min(calculatedPts, 5);
                }
            }
        }

        if (calculatedPts !== p.pontos_ganhos) {
            console.log(`Mismatch! User ${userPoints[p.usuario_id].nome} Jogo ${p.jogos.time_a} x ${p.jogos.time_b} (${p.jogos.data_hora}): DB=${p.pontos_ganhos}, Calc=${calculatedPts}`);
            mismatchCount++;
        }

        if (userPoints[p.usuario_id]) {
            userPoints[p.usuario_id].ganhos += p.pontos_ganhos || 0;
            userPoints[p.usuario_id].total += p.pontos_ganhos || 0;
        }
    }

    if (mismatchCount === 0) {
        console.log("\nAll points in DB match the calculation rule 100%!");
    }

    const leaderboard = Object.values(userPoints).sort((a, b) => b.total - a.total);
    console.log("\nLEADERBOARD:");
    leaderboard.forEach((u, i) => {
        console.log(`${i+1}. ${u.nome}: ${u.total} (Legado: ${u.legado}, Ganhos: ${u.ganhos})`);
    });
    
    // Print guesses for 23 and 24 to show user
    console.log("\nRECENT MATCHES (23rd and 24th):");
    const recentMatches = [...new Set(palpites.filter(p => p.jogos && (p.jogos.data_hora.includes('-06-23') || p.jogos.data_hora.includes('-06-24'))).map(p => p.jogos.id))];
    
    for (const matchId of recentMatches) {
        const matchInfo = palpites.find(p => p.jogos && p.jogos.id === matchId).jogos;
        console.log(`\nMatch: ${matchInfo.time_a} ${matchInfo.placar_oficial_a ?? '?'} x ${matchInfo.placar_oficial_b ?? '?'} ${matchInfo.time_b} (${matchInfo.data_hora} - ${matchInfo.status})`);
        
        const guessesForMatch = palpites.filter(p => p.jogo_id === matchId);
        guessesForMatch.forEach(g => {
            const userName = userPoints[g.usuario_id] ? userPoints[g.usuario_id].nome : 'Unknown';
            console.log(` - ${userName}: ${g.palpite_a} x ${g.palpite_b} -> ${g.pontos_ganhos} pts`);
        });
    }
}

checkPoints();
