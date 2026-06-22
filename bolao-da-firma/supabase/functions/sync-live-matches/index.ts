import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Mocking an external API call (e.g., API-Football)
    // In a real scenario, this would be: 
    // const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', { headers: { 'x-apisports-key': API_KEY } })
    const mockApiResponse = {
      response: [
        {
          fixture: { id: 1, status: { short: '2H' } }, // LIVE
          teams: { home: { name: 'Brasil' }, away: { name: 'Alemanha' } },
          goals: { home: 2, away: 0 }
        },
        {
          fixture: { id: 2, status: { short: 'FT' } }, // FINISHED
          teams: { home: { name: 'França' }, away: { name: 'Argentina' } },
          goals: { home: 1, away: 1 }
        }
      ]
    };

    const matchesToUpdate = mockApiResponse.response;
    const updatePromises = [];

    for (const match of matchesToUpdate) {
      // Map API status to our status
      let status = 'SCHEDULED';
      if (['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT'].includes(match.fixture.status.short)) {
        status = 'LIVE';
      } else if (['FT', 'AET', 'PEN'].includes(match.fixture.status.short)) {
        status = 'FINISHED';
      }

      const scoreA = match.goals.home !== null ? match.goals.home : null;
      const scoreB = match.goals.away !== null ? match.goals.away : null;

      // Defensive check: we only update score if it's available. If it's null, we don't overwrite if not explicitly required.
      // We will look up the team by name or ideally an external API ID in a real system.
      // For this spec, we update by team names (which is brittle but works for demo).
      
      const updateData: any = { status };
      if (scoreA !== null) updateData.placar_oficial_a = scoreA;
      if (scoreB !== null) updateData.placar_oficial_b = scoreB;

      const promise = supabase
        .from('jogos')
        .update(updateData)
        .eq('time_a', match.teams.home.name)
        .eq('time_b', match.teams.away.name);

      updatePromises.push(promise);
    }

    await Promise.all(updatePromises);

    return new Response(
      JSON.stringify({ message: 'Sync completed successfully', processed: matchesToUpdate.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
