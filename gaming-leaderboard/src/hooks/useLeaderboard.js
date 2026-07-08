import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useLeaderboard(gameCode) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!gameCode) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc(
        'get_game_leaderboard_by_code',
        { in_game_code: gameCode, in_limit: 10 }
      );

      if (rpcError) throw rpcError;
      setLeaderboard(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch leaderboard');
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }, [gameCode]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { leaderboard, loading, error, refresh };
}
