# Edge Functions API Documentation

## 1. get-game-leaderboard
Retrieves the leaderboard for a specific game. This function is public and does not require an API key.

**Endpoint:**
`GET https://mpzmyzgsprxexqbfnqsj.supabase.co/functions/v1/get-game-leaderboard`

**Query Parameters:**
- `game_id` (required): The ID of the game.
- `limit` (optional): The number of scores to return (defaults to 10).

**Example Usage (Terminal):**
```bash
curl -i --location --request GET 'https://mpzmyzgsprxexqbfnqsj.supabase.co/functions/v1/get-game-leaderboard?game_id=my_game_code&limit=10'
```

## 2. enter-leaderboard
Submits a new score to a game's leaderboard. This function is secured using a custom API key.

**Endpoint:**
`POST https://mpzmyzgsprxexqbfnqsj.supabase.co/functions/v1/enter-leaderboard`

**Headers:**
- `Content-Type: application/json`
- `x-api-key`: Your custom secret key.

**Setting the API Key:**
Before using this function, you must set the `CUSTOM_API_KEY` secret in your Supabase project using the CLI:
```bash
npx supabase secrets set CUSTOM_API_KEY=your_super_secret_password --project-ref mpzmyzgsprxexqbfnqsj
```

**Example Usage (Terminal):**
```bash
curl -i --location --request POST 'https://mpzmyzgsprxexqbfnqsj.supabase.co/functions/v1/enter-leaderboard' \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: your_super_secret_password' \
  --data '{"game_id": "my_game_code", "player_id": "player_1", "score": 500}'
```

## Standard Project API Keys
If you need the standard Supabase keys to initialize your frontend client:
- **Project URL:** `https://mpzmyzgsprxexqbfnqsj.supabase.co`
- **Anon/Publishable Key:** `sb_publishable_MrsGflh2Hu_43ppEvUGGZw_7TJsL2ru`
