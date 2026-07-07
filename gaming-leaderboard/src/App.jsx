import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [gameName, setGameName] = useState('');
  const [generatedGameId, setGeneratedGameId] = useState('');

  const [scoreGameId, setScoreGameId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [score, setScore] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const showAlert = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleGenerateGameId = async (e) => {
    e.preventDefault();
    if (!gameName.trim()) {
      showAlert('Game name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_game_id', {
        in_game_name: gameName
      });

      if (error) throw error;

      setGeneratedGameId(data);
      showAlert('Game ID generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating game ID:', error);
      showAlert(error.message || 'Failed to generate Game ID', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditScore = async (e) => {
    e.preventDefault();
    if (!scoreGameId.trim() || !playerId.trim() || !score) {
      showAlert('All fields are required', 'error');
      return;
    }

    const scoreNum = parseInt(score);
    if (isNaN(scoreNum)) {
      showAlert('Score must be a number', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('edit_scores', {
        In_Game_ID: scoreGameId,
        In_Player_ID: playerId,
        In_Score: scoreNum
      });

      if (error) throw error;

      showAlert('Score updated successfully!', 'success');
      console.log('Result:', data);
    } catch (error) {
      console.error('Error updating score:', error);
      showAlert(error.message || 'Failed to update score', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-indigo-400 mb-2">Gaming Leaderboard</h1>
          <p className="text-gray-400">Backend Testing Platform</p>
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
          {/* Generate Game ID Section */}
          <section className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="bg-indigo-500 w-2 h-6 rounded mr-3"></span>
              Generate Unique Game ID
            </h2>
            <form onSubmit={handleGenerateGameId} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Game Name</label>
                <input
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  placeholder="e.g. Space Invaders"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Processing...' : 'Generate Cryptic ID'}
              </button>
            </form>
            {generatedGameId && (
              <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Generated Game ID:</p>
                <code className="text-indigo-400 font-mono break-all">{generatedGameId}</code>
                <button
                  onClick={() => {
                    setScoreGameId(generatedGameId);
                    showAlert('Copied to Score Update form', 'info');
                  }}
                  className="mt-2 block text-xs text-indigo-300 hover:text-indigo-200"
                >
                  Use for score update
                </button>
              </div>
            )}
          </section>

          {/* Edit Score Section */}
          <section className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="bg-emerald-500 w-2 h-6 rounded mr-3"></span>
              Edit Scores
            </h2>
            <form onSubmit={handleEditScore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Game ID</label>
                <input
                  type="text"
                  value={scoreGameId}
                  onChange={(e) => setScoreGameId(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="Enter Game ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Player ID</label>
                <input
                  type="text"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="Enter Player ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Score</label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="0"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Updating...' : 'Update Score'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
