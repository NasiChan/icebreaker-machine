import React, { useState } from 'react';
import { GeneratedQuestion } from '../types';

interface QuestionCardProps {
  question: GeneratedQuestion;
  isSaved: boolean;
  onToggleSave: (q: GeneratedQuestion) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, isSaved, onToggleSave }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(question.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <article className="bg-slate-800 border border-slate-700 rounded-xl p-0 shadow-sm hover:shadow-lg hover:border-slate-500 transition-all duration-300 flex flex-col group h-full relative overflow-hidden">
      {/* Header: Metadata & Actions */}
      <div className="flex justify-between items-center p-3 bg-slate-900/30 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
           <span 
            className="text-[10px] font-bold font-mono text-pink-300 bg-pink-900/20 px-1.5 py-0.5 rounded border border-pink-500/20"
            title={`Chaos Level: ${question.chaosLevel}`}
           >
            CHAOS {question.chaosLevel}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className={`text-xs font-semibold px-2 py-1 rounded transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 ${
            copied
              ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          aria-label="Copy question text"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Copied</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="p-5 flex-grow flex items-center">
        <p className="text-lg md:text-xl text-slate-100 font-medium leading-relaxed select-text">
          {question.text}
        </p>
      </div>

      {/* Footer: Tags & Save */}
      <div className="p-3 pt-0 mt-auto flex justify-between items-end">
        <div className="flex flex-wrap gap-1.5 max-w-[80%]">
          <span className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full border border-slate-600/50 truncate">
            {question.context}
          </span>
          {question.filters && question.filters.map(f => (
            <span key={f} className="text-[10px] bg-emerald-900/10 text-emerald-400/80 px-2 py-0.5 rounded-full border border-emerald-500/10 truncate">
              {f}
            </span>
          ))}
        </div>
        
        <button
          onClick={() => onToggleSave(question)}
          className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 ${
            isSaved 
            ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20' 
            : 'text-slate-600 hover:text-yellow-200 hover:bg-slate-700'
          }`}
          title={isSaved ? "Remove from saved" : "Save question"}
          aria-label={isSaved ? "Unsave question" : "Save question"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform transition-transform active:scale-90" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>
    </article>
  );
};