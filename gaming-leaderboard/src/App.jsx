import React, { useState } from 'react';

function App() {
  const [gameId, setGameId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [score, setScore] = useState('');
  const [apiKey, setApiKey] = useState('');

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const PROJECT_URL = "https://mpzmyzgsprxexqbfnqsj.supabase.co";

  const showAlert = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleEnterLeaderboard = async (e) => {
    e.preventDefault();
    if (!gameId || !playerId || !score || !apiKey) {
      showAlert('All fields including API Key are required', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${PROJECT_URL}/functions/v1/enter-leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          game_id: gameId,
          player_id: playerId,
          score: parseInt(score)
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit');

      showAlert(`Success: ${result.status}`, 'success');
      fetchLeaderboard();
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    if (!gameId) return;
    try {
      const response = await fetch(`${PROJECT_URL}/functions/v1/get-game-leaderboard?game_id=${gameId}&limit=10`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch');
      setLeaderboard(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-indigo-400 mb-2">Gaming Leaderboard</h1>
          <p className="text-gray-400">Secure API Tester</p>
        </header>

        {message.text && (
          <div className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 ${
            message.type === 'error' ? 'bg-red-600' :
            message.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Submit Score Section */}
          <section className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="bg-emerald-500 w-2 h-6 rounded mr-3"></span>
              Submit Score (Edge Function)
            </h2>
            <form onSubmit={handleEnterLeaderboard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter x-api-key"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Game Code</label>
                  <input
                    type="text"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. G001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Player Code</label>
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. P001"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Score</label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Score via API'}
              </button>
            </form>
          </section>

          {/* Leaderboard Section */}
          <section className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="bg-indigo-500 w-2 h-6 rounded mr-3"></span>
              Live Leaderboard: {gameId || 'None'}
            </h2>
            <button
              onClick={fetchLeaderboard}
              className="mb-4 text-xs text-indigo-400 hover:text-indigo-300"
            >
              Refresh
            </button>
            <div className="space-y-2">
              {leaderboard.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No entries found for this game.</p>
              ) : (
                leaderboard.map((entry) => (
                  <div key={entry.player_id} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <div className="flex items-center">
                      <span className="w-8 text-gray-500 font-mono">#{entry.rank}</span>
                      <div>
                        <p className="font-medium">{entry.display_name}</p>
                        <p className="text-xs text-gray-500">{entry.player_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-400 font-bold">{entry.score.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-600">{new Date(entry.updated_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
