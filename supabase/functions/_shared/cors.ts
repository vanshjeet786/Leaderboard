// CORS Configuration
// NOTE: In production, replace the wildcard '*' origin with your actual domain
// (e.g., 'https://your-app.com') to prevent unauthorized cross-origin requests.
// You can use: Deno.env.get('ALLOWED_ORIGIN') || '*'
export const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}
