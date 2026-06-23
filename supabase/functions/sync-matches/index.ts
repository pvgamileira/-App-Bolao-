import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 🌟 CÁLCULO DINÂMICO DE DATAS (Sem nunca mais hardcodar dias)
        // Alterado para sempre buscar desde o início da Copa (11/06/2026) para sincronizar os jogos passados
        const inicioCopa = new Date('2026-06-11T00:00:00Z');
        const hoje = new Date();
        const duasSemanasPraFrente = new Date();
        duasSemanasPraFrente.setDate(hoje.getDate() + 14);

        // Formata os objetos Date para o padrão YYYYMMDD exigido pela ESPN
        const formatESPN = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
        const intervaloDatas = `${formatESPN(inicioCopa)}-${formatESPN(duasSemanasPraFrente)}`;

        // Monta a URL dinamicamente com a janela móvel de jogos
        const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${intervaloDatas}`;

        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) throw new Error(`Erro ESPN: ${response.status}`);
        const data = await response.json();

        if (!data.events || data.events.length === 0) {
            return new Response(JSON.stringify({ success: true, message: 'Nenhum jogo encontrado no intervalo móvel.' }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const matchesToUpsert = data.events.map((event: any) => {
            const competition = event.competitions[0];
            const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
            const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');

            let mappedStatus = 'SCHEDULED';
            const espnStatus = event.status.type.name;

            if (['STATUS_IN_PROGRESS', 'STATUS_FIRST_HALF', 'STATUS_SECOND_HALF'].includes(espnStatus)) {
                mappedStatus = 'LIVE';
            } else if (['STATUS_FINAL', 'STATUS_FULL_TIME'].includes(espnStatus)) {
                mappedStatus = 'FINISHED';
            }

            return {
                api_id: parseInt(event.id),
                time_a: homeTeam.team.displayName,
                time_b: awayTeam.team.displayName,
                logo_a: homeTeam.team.logo || null,
                logo_b: awayTeam.team.logo || null,
                data_hora: competition.date,
                placar_oficial_a: mappedStatus !== 'SCHEDULED' ? parseInt(homeTeam.score) : null,
                placar_oficial_b: mappedStatus !== 'SCHEDULED' ? parseInt(awayTeam.score) : null,
                status: mappedStatus
            };
        });

        const { error } = await supabase
            .from('jogos')
            .upsert(matchesToUpsert, { onConflict: 'api_id' });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, synced: matchesToUpsert.length, window: intervaloDatas }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
})