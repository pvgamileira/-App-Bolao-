import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!; // Ignora RLS para escrita de background

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Bate no endpoint público e 100% gratuito do repositório
    const response = await fetch('https://worldcup26.ir/get/games', {
      method: 'GET'
    });

    if (!response.ok) throw new Error(`Erro ao conectar com a API WorldCup26: ${response.status}`);
    const data = await response.json();

    // A API retorna um objeto contendo um array em data.games
    if (!data.games || data.games.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'Nenhum jogo encontrado na API.' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mapeia o JSON da nova API para as colunas do seu banco PostgreSQL
    const matchesToUpsert = data.games.map((game: any) => {
      let mappedStatus = 'SCHEDULED';

      // Tradução dos status da nova API para o seu motor de pontos
      if (game.finished === 'TRUE' || game.finished === true) {
        mappedStatus = 'FINISHED';
      } else if (game.time_elapsed !== 'notstarted') {
        mappedStatus = 'LIVE';
      }

      // Tratamento de datas (ajusta o formato MM/DD/YYYY para formato ISO aceito pelo Postgres)
      const dateParts = game.local_date.split(' ');
      const dayMonthYear = dateParts[0].split('/');
      const formattedDate = `${dayMonthYear[2]}-${dayMonthYear[0]}-${dayMonthYear[1]}T${dateParts[1]}:00Z`;

      return {
        api_id: parseInt(game.id),
        time_a: game.home_team_name_en,
        time_b: game.away_team_name_en,
        data_hora: formattedDate,
        placar_oficial_a: game.home_score !== 'null' ? parseInt(game.home_score) : null,
        placar_oficial_b: game.away_score !== 'null' ? parseInt(game.away_score) : null,
        status: mappedStatus
      };
    });

    // Salva ou atualiza os jogos de uma vez só, blindando contra duplicidade pelo api_id
    const { error } = await supabase
      .from('jogos')
      .upsert(matchesToUpsert, { onConflict: 'api_id' });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, partidas_sincronizadas: matchesToUpsert.length }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
})