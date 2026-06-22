import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase Admin Client using env vars provided to functions automatically
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Fetch external API
    const apiKey = Deno.env.get('SPORTS_API_KEY') ?? 'dummy_key';
    
    // We use a dummy payload simulating API-Football for today's matches
    // In production, we would use fetch with the actual endpoint and apiKey.
    const dummyMatches = [
      {
        fixture: {
          id: 1001,
          date: new Date().toISOString(),
          status: { short: "LIVE" }
        },
        teams: {
          home: { name: "Brazil" },
          away: { name: "Argentina" }
        },
        goals: {
          home: 2,
          away: 1
        }
      },
      {
        fixture: {
          id: 1002,
          date: new Date().toISOString(),
          status: { short: "FT" }
        },
        teams: {
          home: { name: "France" },
          away: { name: "England" }
        },
        goals: {
          home: 0,
          away: 0
        }
      }
    ];

    // 3. Map to our database schema
    const mappedJogos = dummyMatches.map(match => {
      let status = 'SCHEDULED';
      if (['LIVE', '1H', '2H', 'HT'].includes(match.fixture.status.short)) {
        status = 'LIVE';
      } else if (['FT', 'AET', 'PEN'].includes(match.fixture.status.short)) {
        status = 'FINISHED';
      }

      return {
        api_id: match.fixture.id,
        time_a: match.teams.home.name,
        time_b: match.teams.away.name,
        data_hora: match.fixture.date,
        placar_oficial_a: match.goals.home,
        placar_oficial_b: match.goals.away,
        status: status
      };
    });

    // 4. Upsert into database
    const { data, error } = await supabaseAdmin
      .from('jogos')
      .upsert(mappedJogos, { onConflict: 'api_id' })
      .select();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ message: "Sync completed successfully", syncedMatches: data?.length || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Sync error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
