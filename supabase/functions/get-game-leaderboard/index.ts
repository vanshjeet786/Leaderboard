import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const game_id = url.searchParams.get("game_id")
    const limit = parseInt(url.searchParams.get("limit") || "10")

    if (!game_id) {
      return new Response(JSON.stringify({ error: "Missing game_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    // T11: Input validation — game_id length
    if (game_id.length > 20) {
      return new Response(JSON.stringify({ error: "game_id must be 20 characters or fewer" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    // T11: Input validation — limit range
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return new Response(JSON.stringify({ error: "limit must be between 1 and 100" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data, error } = await supabase.rpc('get_game_leaderboard_by_code', {
      in_game_code: game_id,
      in_limit: limit
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })

  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})
