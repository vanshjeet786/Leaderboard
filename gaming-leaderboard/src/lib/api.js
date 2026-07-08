const BASE_URL = import.meta.env.VITE_SUPABASE_URL;

export async function submitScore(apiKey, gameId, playerId, score) {
  const response = await fetch(`${BASE_URL}/functions/v1/enter-leaderboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      game_id: gameId,
      player_id: playerId,
      score: parseInt(score, 10),
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Failed to submit score');
  return result;
}
