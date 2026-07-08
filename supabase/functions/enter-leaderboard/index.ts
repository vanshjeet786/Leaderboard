import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const API_KEY = Deno.env.get("CUSTOM_API_KEY")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const apiKeyHeader = req.headers.get("x-api-key")
  if (!apiKeyHeader || apiKeyHeader !== API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }

  try {
    const { game_id, player_id, score } = await req.json()

    if (!game_id || !player_id || typeof score !== 'number' || score < 0) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabase.rpc('submit_score_by_code', {
      in_game_code: game_id,
      in_player_code: player_id,
      in_score: score
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    return new Response(JSON.stringify({ status: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })

  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})
