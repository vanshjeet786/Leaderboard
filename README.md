# Gaming Leaderboard Backend

A secure, high-performance leaderboard system built on Supabase. This project allows external game developers to submit player scores through an authenticated API and retrieve ranked leaderboards.

## Project Setup

1. **Database Schema**: Apply the migrations provided in `supabase/migrations` (or the SQL provided in this README).
2. **Edge Functions**: Deploy the `enter-leaderboard` and `get-game-leaderboard` functions.
3. **Environment Variables**: Configure the required secrets in your Supabase project.

## Database Schema

### `games`
- `id`: UUID (Primary Key)
- `game_code`: TEXT (Unique) - Use this for API calls (e.g., 'G001').
- `game_name`: TEXT
- `created_at`: TIMESTAMPTZ

### `players`
- `id`: UUID (Primary Key)
- `player_code`: TEXT (Unique) - Use this for API calls (e.g., 'P001').
- `display_name`: TEXT
- `created_at`: TIMESTAMPTZ

### `leaderboard_entries`
- `id`: UUID (Primary Key)
- `game_id`: UUID (FK -> games.id)
- `player_id`: UUID (FK -> players.id)
- `score`: BIGINT
- `saved_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ
- **Constraints**: UNIQUE(game_id, player_id)
- **Indexes**: `idx_leaderboard_game_score` (game_id, score DESC)

## Seeded Data

### Games (10)
| Code | Name |
|---|---|
| G001 | Space Invaders Redux |
| G002 | Cyber Runner |
| G003 | Dungeon Master |
| ... | ... |
| G010 | Final Frontier |

### Players (30)
| Code | Display Name |
|---|---|
| P001 | AcePilot |
| P002 | BladeRunner |
| P003 | CyberGhost |
| ... | ... |
| P030 | Delta |

## API Documentation

### Submit Score
**Endpoint**: `POST /functions/v1/enter-leaderboard`
**Headers**:
- `x-api-key`: Your secret API key.
- `Content-Type`: `application/json`

**Body**:
```json
{
  "game_id": "G001",
  "player_id": "P001",
  "score": 8450
}
```

**Responses**:
- `200 OK`: `{"status": "inserted"}` | `{"status": "updated"}` | `{"status": "ignored"}`
- `401 Unauthorized`: Invalid or missing API key.
- `400 Bad Request`: Missing fields or invalid game/player code.

### Get Leaderboard
**Endpoint**: `GET /functions/v1/get-game-leaderboard`
**Parameters**:
- `game_id`: (Required) The game code (e.g., `G001`).
- `limit`: (Optional) Number of results to return (default: 10).

**Response**:
```json
[
  {
    "rank": 1,
    "player_id": "P002",
    "display_name": "BladeRunner",
    "score": 500,
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

## Environment Variables / Secrets

Set these in your Supabase project:
- `CUSTOM_API_KEY`: The secret key required for the `x-api-key` header.

## How to Deploy

1. **Database**: Run the SQL in `supabase/migrations`.
2. **Secrets**:
   ```bash
   supabase secrets set CUSTOM_API_KEY=your_secret_key
   ```
3. **Functions**:
   ```bash
   supabase functions deploy enter-leaderboard --no-verify-jwt
   supabase functions deploy get-game-leaderboard --no-verify-jwt
   ```

## Example Curl

```bash
curl -X POST "https://<project>.supabase.co/functions/v1/enter-leaderboard" \
  -H "x-api-key: your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{"game_id":"G001", "player_id":"P001", "score":100}'
```
