import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const url = new URL(req.url)
  const game_id = url.searchParams.get("game_id")
  const limit = parseInt(url.searchParams.get("limit") || "10")

  if (!game_id) {
    return new Response(JSON.stringify({ error: "Missing game_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
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
      headers: { "Content-Type": "application/json" }
    })
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  })
})
