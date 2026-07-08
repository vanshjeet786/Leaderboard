import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const rankMeta = {
  1: { emoji: '🥇', glow: 'shadow-yellow-500/30 border-yellow-500/40', accent: 'text-yellow-400', bg: 'bg-yellow-500/5' },
  2: { emoji: '🥈', glow: 'shadow-gray-300/20 border-gray-400/30', accent: 'text-gray-300', bg: 'bg-gray-400/5' },
  3: { emoji: '🥉', glow: 'shadow-amber-600/20 border-amber-600/30', accent: 'text-amber-500', bg: 'bg-amber-600/5' },
};

function PlayerAvatar({ name, rank }) {
  const initials = (name || '??')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    'from-purple-500 to-cyan-500',
    'from-pink-500 to-orange-500',
    'from-emerald-500 to-teal-500',
    'from-indigo-500 to-purple-500',
    'from-rose-500 to-pink-500',
    'from-cyan-500 to-blue-500',
  ];
  const colorIdx = (name || '').charCodeAt(0) % colors.length;

  return (
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[colorIdx]}
        flex items-center justify-center text-xs font-bold text-white
        shadow-lg flex-shrink-0
        ${rank <= 3 ? 'ring-2 ring-white/10' : ''}`}
    >
      {initials}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-slate-700" />
      <div className="w-10 h-10 rounded-xl bg-slate-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-700 rounded w-1/3" />
        <div className="h-3 bg-slate-700/60 rounded w-1/5" />
      </div>
      <div className="h-5 bg-slate-700 rounded w-16" />
    </div>
  );
}

export default function Leaderboard({
  leaderboard,
  loading,
  error,
  gameCode,
  onRefresh,
  onGameCodeChange,
}) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const { data, error: fetchErr } = await supabase
          .from('games')
          .select('game_code, game_name')
          .order('game_code');
        if (fetchErr) throw fetchErr;
        setGames(data || []);
        
        // Auto-select first game if none is selected
        if (!gameCode && data && data.length > 0) {
          onGameCodeChange(data[0].game_code);
        }
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    }
    fetchGames();
  }, [gameCode, onGameCodeChange]);

  return (
    <div className="leaderboard-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-gaming text-2xl tracking-wider uppercase bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Leaderboard
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Game:</span>
            <select
              value={gameCode}
              onChange={(e) => onGameCodeChange(e.target.value)}
              className="bg-slate-900/90 border border-slate-700/50 rounded-lg px-2 py-1 text-xs text-cyan-400 font-semibold focus:border-cyan-500/80 outline-none transition-all duration-300 cursor-pointer"
            >
              {games.length === 0 ? (
                <option value="" disabled>Loading...</option>
              ) : (
                games.map((g) => (
                  <option key={g.game_code} value={g.game_code} className="bg-slate-950 text-gray-200">
                    {g.game_name} ({g.game_code})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider
            bg-gradient-to-r from-purple-600/20 to-cyan-600/20
            border border-purple-500/20 text-purple-300
            hover:from-purple-600/30 hover:to-cyan-600/30 hover:border-purple-500/40
            transition-all duration-300 disabled:opacity-40"
        >
          {loading ? '⟳' : '↻'} Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 opacity-30">🏆</div>
            <p className="text-gray-500 text-sm">
              No entries yet. Submit a score to get started!
            </p>
          </div>
        ) : (
          leaderboard.map((entry, idx) => {
            const meta = rankMeta[entry.rank];
            return (
              <div
                key={entry.player_id}
                className={`flex items-center gap-4 p-4 rounded-xl border
                  transition-all duration-300 cursor-default
                  hover:scale-[1.02] hover:shadow-xl
                  animate-fade-in-up
                  ${
                    meta
                      ? `${meta.bg} ${meta.glow} shadow-lg`
                      : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
                  }`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Rank */}
                <div className="w-8 text-center flex-shrink-0">
                  {meta ? (
                    <span className="text-2xl drop-shadow-lg">{meta.emoji}</span>
                  ) : (
                    <span className="text-gray-500 font-mono text-sm font-bold">
                      #{entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <PlayerAvatar
                  name={entry.display_name}
                  rank={entry.rank}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold truncate ${
                      meta ? meta.accent : 'text-gray-200'
                    }`}
                  >
                    {entry.display_name}
                  </p>
                  <p className="text-[11px] text-gray-500 font-mono">
                    {entry.player_id}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold font-mono bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {entry.score?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-600">
                    {entry.updated_at
                      ? new Date(entry.updated_at).toLocaleTimeString()
                      : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
