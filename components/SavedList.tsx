import React, { useState } from 'react';
import { GeneratedQuestion } from '../types';

interface SavedListProps {
  savedQuestions: GeneratedQuestion[];
  onRemove: (id: string) => void;
}

export const SavedList: React.FC<SavedListProps> = ({ savedQuestions, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (savedQuestions.length === 0) {
    return (
      <div className="mt-12 text-center p-8 border border-dashed border-slate-700 rounded-xl">
        <p className="text-slate-500">Tap the ⭐ on any question to save it for later.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-slate-800 pt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 text-xl font-bold text-slate-200 hover:text-white transition-colors w-full"
      >
        <span>⭐ Saved Questions ({savedQuestions.length})</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-6 space-y-4 animate-fadeIn">
          {savedQuestions.map((q) => (
            <div key={q.id} className="bg-slate-800/50 rounded-lg p-4 flex justify-between items-center gap-4 border border-slate-700/50">
              <div className="flex-1">
                <p className="text-slate-200 text-sm md:text-base">"{q.text}"</p>
                <div className="flex gap-2 mt-2">
                   <span className="text-[10px] text-slate-500 uppercase">{q.context}</span>
                   <span className="text-[10px] text-slate-500">• Chaos: {q.chaosLevel}</span>
                </div>
              </div>
              <button
                onClick={() => onRemove(q.id)}
                className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                title="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};