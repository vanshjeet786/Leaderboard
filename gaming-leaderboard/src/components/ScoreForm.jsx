import { useState } from 'react';

export default function ScoreForm({ onSubmit, loading }) {
  const [apiKey, setApiKey] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [playerCode, setPlayerCode] = useState('');
  const [score, setScore] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey || !gameCode || !playerCode || !score) return;
    onSubmit({ apiKey, gameCode, playerCode, score });
  };

  return (
    <div className="score-form-card group">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between mb-4"
      >
        <h2 className="font-gaming text-lg tracking-wider uppercase bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Submit Score
        </h2>
        <span
          className={`text-gray-500 transition-transform duration-300 ${
            collapsed ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          collapsed ? 'max-h-0 opacity-0' : 'max-h-[600px] opacity-100'
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="form-input-gaming"
              placeholder="Enter your x-api-key"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                Game Code
              </label>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                className="form-input-gaming"
                placeholder="G001"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                Player Code
              </label>
              <input
                type="text"
                value={playerCode}
                onChange={(e) => setPlayerCode(e.target.value)}
                className="form-input-gaming"
                placeholder="P001"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
              Score
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="form-input-gaming"
              placeholder="0"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit-gaming w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </span>
            ) : (
              'Submit Score'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
