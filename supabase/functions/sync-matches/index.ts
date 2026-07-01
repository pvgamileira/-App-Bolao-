// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL')!;
        // Tenta buscar as vars de ambiente; se o Supabase bloquear com SUPABASE_, usamos SERVICE_ROLE_KEY
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_ROLE_KEY')!;
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
            const displayClock = event.status.displayClock;
            const isLive = espnStatus.includes('IN_PROGRESS') || espnStatus.includes('HALF') || espnStatus.includes('OVERTIME') || espnStatus.includes('SHOOTOUT') || espnStatus.includes('EXTRA_TIME') || espnStatus === 'STATUS_PLAY_DELAYED';
            const isFinished = espnStatus.includes('FINAL') || espnStatus.includes('FULL_TIME');

            if (isLive) {
                mappedStatus = 'LIVE';
            } else if (isFinished) {
                mappedStatus = 'FINISHED';
            }

            // Detect penalties / prorogation from ESPN data if available
            // ESPN might set event.status.type.name to 'STATUS_FINAL_PEN' or similar
            // or have shootoutScore inside competitor
            let foi_para_prorogacao = espnStatus.includes('AET') || espnStatus.includes('PEN') || espnStatus.includes('SHOOTOUT') || espnStatus.includes('OVERTIME');
            let foi_para_penaltis = espnStatus.includes('PEN') || espnStatus.includes('SHOOTOUT') || (homeTeam.shootoutScore !== undefined);
            let vencedor_penaltis = null;

            if (foi_para_penaltis && mappedStatus === 'FINISHED') {
                const homePen = parseInt(homeTeam.shootoutScore || 0);
                const awayPen = parseInt(awayTeam.shootoutScore || 0);
                if (homePen > awayPen) vencedor_penaltis = 'A';
                else if (awayPen > homePen) vencedor_penaltis = 'B';
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
                status: mappedStatus,
                tempo_decorrido: displayClock || null,
                foi_para_prorogacao,
                foi_para_penaltis,
                vencedor_penaltis
            };
        });

        const { error } = await supabase
            .from('jogos')
            .upsert(matchesToUpsert, { onConflict: 'api_id' });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, synced: matchesToUpsert.length, window: intervaloDatas }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

    } catch (error: any) {
        console.error('Falha geral no sync-matches:', error)
        return new Response(JSON.stringify({ error: error.message || String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
})