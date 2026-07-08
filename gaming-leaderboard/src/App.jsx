import { useState } from 'react';
import ScoreForm from './components/ScoreForm';
import Leaderboard from './components/Leaderboard';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';
import { useLeaderboard } from './hooks/useLeaderboard';
import { submitScore } from './lib/api';

function App() {
  const [gameCode, setGameCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast, showToast, dismissToast } = useToast();
  const { leaderboard, loading, error, refresh } = useLeaderboard(gameCode);

  const handleSubmit = async ({ apiKey, gameCode: code, playerCode, score }) => {
    setGameCode(code);
    setSubmitting(true);
    try {
      const result = await submitScore(apiKey, code, playerCode, score);
      showToast(`Score submitted: ${result.status}`, 'success');
      // Small delay to allow the game code state to update before refresh
      setTimeout(() => refresh(), 100);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-animate opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
        {/* Hero Header */}
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-gaming text-5xl md:text-7xl tracking-widest uppercase bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl">
            Leaderboard
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-500 tracking-[0.3em] uppercase animate-pulse-glow">
            Real-time competitive rankings
          </p>
        </header>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <Leaderboard
            leaderboard={leaderboard}
            loading={loading}
            error={error}
            gameCode={gameCode}
            onRefresh={refresh}
            onGameCodeChange={setGameCode}
          />
          <ScoreForm onSubmit={handleSubmit} loading={submitting} />
        </div>
      </div>

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
