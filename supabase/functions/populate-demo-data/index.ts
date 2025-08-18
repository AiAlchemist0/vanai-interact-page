import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sample geographic data
    const geographicData = [
      { region: 'BC', city: 'Vancouver', listening_count: 45 },
      { region: 'BC', city: 'Victoria', listening_count: 32 },
      { region: 'BC', city: 'Surrey', listening_count: 28 },
      { region: 'BC', city: 'Burnaby', listening_count: 25 },
      { region: 'BC', city: 'Richmond', listening_count: 22 },
      { region: 'AB', city: 'Calgary', listening_count: 18 },
      { region: 'AB', city: 'Edmonton', listening_count: 15 },
      { region: 'ON', city: 'Toronto', listening_count: 35 },
      { region: 'ON', city: 'Ottawa', listening_count: 12 },
      { region: 'QC', city: 'Montreal', listening_count: 20 },
    ];

    // Insert geographic data
    for (const geo of geographicData) {
      const { error } = await supabaseClient
        .from('geographic_data')
        .upsert({
          region: geo.region,
          city: geo.city,
          listening_count: geo.listening_count,
          last_activity: new Date().toISOString()
        }, {
          onConflict: 'region,city'
        });

      if (error) {
        console.error('Error inserting geographic data:', error);
      }
    }

    // Sample session data
    const now = new Date();
    const sessions = [];
    
    for (let i = 0; i < 20; i++) {
      const sessionStart = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Within last 7 days
      const sessionDuration = Math.floor(Math.random() * 3600) + 300; // 5 minutes to 1 hour
      const sessionEnd = new Date(sessionStart.getTime() + sessionDuration * 1000);
      const songsPlayed = Math.floor(Math.random() * 8) + 1; // 1-8 songs
      
      sessions.push({
        user_session_id: `demo_session_${i}_${Date.now()}`,
        started_at: sessionStart.toISOString(),
        ended_at: Math.random() > 0.2 ? sessionEnd.toISOString() : null, // 20% chance of active session
        total_duration_seconds: Math.random() > 0.2 ? sessionDuration : Math.floor(sessionDuration * Math.random()),
        total_songs_played: songsPlayed,
        device_type: Math.random() > 0.6 ? 'mobile' : 'desktop',
        browser_type: ['chrome', 'firefox', 'safari'][Math.floor(Math.random() * 3)]
      });
    }

    // Insert session data
    const { error: sessionError } = await supabaseClient
      .from('listening_sessions')
      .insert(sessions);

    if (sessionError) {
      console.error('Error inserting session data:', sessionError);
      throw sessionError;
    }

    // Add some real-time metrics
    const metrics = [
      { metric_type: 'active_listeners', metric_value: Math.floor(Math.random() * 50) + 10 },
      { metric_type: 'current_plays', metric_value: Math.floor(Math.random() * 200) + 100 },
      { metric_type: 'system_load', metric_value: Math.floor(Math.random() * 30) + 20 },
    ];

    const { error: metricsError } = await supabaseClient
      .from('real_time_metrics')
      .insert(metrics);

    if (metricsError) {
      console.error('Error inserting metrics data:', metricsError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo data populated successfully',
        inserted: {
          geographic_records: geographicData.length,
          session_records: sessions.length,
          metric_records: metrics.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})