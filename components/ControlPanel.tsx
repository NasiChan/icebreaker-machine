import React from 'react';
import { ContextType, ChaosLevel, FilterType, GameMode } from '../types';

interface ControlPanelProps {
  mode: GameMode;
  setMode: (m: GameMode) => void;
  context: ContextType;
  setContext: (c: ContextType) => void;
  chaos: ChaosLevel;
  setChaos: (l: ChaosLevel) => void;
  filters: FilterType[];
  toggleFilter: (f: FilterType) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const CONTEXT_OPTIONS = Object.values(ContextType);
const FILTER_OPTIONS: FilterType[] = ['Small Talk', 'Deep', 'Silly', 'Unhinged', 'Philosophical'];

const CHAOS_LABELS: Record<ChaosLevel, { label: string; emoji: string }> = {
  1: { label: "Safe & Wholesome", emoji: "😇" },
  2: { label: "A Little Spicy", emoji: "🙂" },
  3: { label: "Fun & Unhinged", emoji: "😏" },
  4: { label: "Bold & Chaotic", emoji: "🤪" },
  5: { label: "Max Chaos", emoji: "🔥" },
};

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  setMode,
  context,
  setContext,
  chaos,
  setChaos,
  filters,
  toggleFilter,
  onGenerate,
  isLoading
}) => {
  return (
    <section 
      aria-label="Configuration" 
      className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl mb-10 transition-all hover:border-slate-600 relative overflow-hidden"
    >
      {/* Mode Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900/50 p-1 rounded-xl flex gap-1 border border-slate-700">
          <button
            onClick={() => setMode('list')}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              mode === 'list'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📋 List Generator
          </button>
          <button
            onClick={() => setMode('spin')}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'spin'
                ? 'bg-pink-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🍾 Spin the Bottle
          </button>
        </div>
      </div>
      
      {/* Context Selector */}
      <div className="mb-8 text-center">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
          1. Choose Context
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {CONTEXT_OPTIONS.map((opt) => {
            const isSelected = context === opt;
            return (
              <button
                key={opt}
                onClick={() => setContext(opt)}
                disabled={isLoading}
                aria-pressed={isSelected}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 focus:ring-indigo-500 scale-105'
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-750 focus:ring-slate-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chaos Slider */}
      <div className="mb-8 text-center">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center justify-center gap-2">
            2. Chaos Level
            <span className="bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-xs font-mono ml-1 border border-slate-600">
              {chaos}/5 {CHAOS_LABELS[chaos].emoji}
            </span>
          </h2>
        </div>
        
        <div className="relative h-12 flex flex-col justify-center max-w-lg mx-auto">
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={chaos}
            disabled={isLoading}
            onChange={(e) => setChaos(Number(e.target.value) as ChaosLevel)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-colors z-10 relative"
            aria-label="Chaos Level Slider"
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={chaos}
          />
          {/* Track markers */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1 pointer-events-none text-[8px] text-slate-600">
             <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
          </div>
        </div>

        <div className="mt-2 text-center">
          <p className="text-pink-400 font-medium text-lg transition-all duration-300">
            {CHAOS_LABELS[chaos].label}
          </p>
        </div>
      </div>

      {/* Vibe Filters */}
      <div className="mb-10 text-center">
         <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4 flex items-center justify-center gap-2">
          3. Vibes <span className="text-[10px] normal-case font-normal bg-slate-700 px-2 py-0.5 rounded-full text-slate-400">Optional</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {FILTER_OPTIONS.map((f) => {
             const isSelected = filters.includes(f);
             return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                disabled={isLoading}
                aria-pressed={isSelected}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  isSelected
                    ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400 focus:ring-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300 focus:ring-slate-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Button (Only in List Mode) */}
      {mode === 'list' && (
        <button
          onClick={onGenerate}
          disabled={isLoading}
          aria-busy={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform focus:outline-none focus:ring-4 focus:ring-indigo-500/30 ${
            isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-indigo-900/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="animate-pulse">Brewing Chaos...</span>
            </>
          ) : (
            <>
              <span>Generate Questions</span>
              <span className="text-xl">✨</span>
            </>
          )}
        </button>
      )}

    </section>
  );
};