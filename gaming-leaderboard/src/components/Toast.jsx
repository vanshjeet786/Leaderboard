const typeConfig = {
  success: {
    icon: '✓',
    border: 'border-emerald-500/40',
    glow: 'shadow-emerald-500/20',
    bar: 'bg-emerald-400',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  error: {
    icon: '✗',
    border: 'border-red-500/40',
    glow: 'shadow-red-500/20',
    bar: 'bg-red-400',
    iconBg: 'bg-red-500/20 text-red-400',
  },
  info: {
    icon: 'ℹ',
    border: 'border-cyan-500/40',
    glow: 'shadow-cyan-500/20',
    bar: 'bg-cyan-400',
    iconBg: 'bg-cyan-500/20 text-cyan-400',
  },
};

export default function Toast({ toast, onDismiss }) {
  if (!toast.visible) return null;

  const cfg = typeConfig[toast.type] || typeConfig.info;

  return (
    <div
      className={`fixed top-6 right-6 z-50 min-w-[320px] max-w-md
        bg-slate-900/80 backdrop-blur-xl border ${cfg.border}
        rounded-xl shadow-2xl ${cfg.glow}
        animate-slide-in-right overflow-hidden`}
    >
      <div className="flex items-start gap-3 p-4">
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${cfg.iconBg}`}
        >
          {cfg.icon}
        </span>
        <p className="flex-1 text-sm text-gray-200 pt-1 font-medium">
          {toast.text}
        </p>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-500 hover:text-white transition-colors text-lg leading-none mt-0.5"
        >
          ×
        </button>
      </div>
      {/* Auto-dismiss progress bar */}
      <div className={`h-0.5 ${cfg.bar} animate-toast-progress`} />
    </div>
  );
}
