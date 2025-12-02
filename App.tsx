import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { QuestionCard } from './components/QuestionCard';
import { SavedList } from './components/SavedList';
import { Background } from './components/Background';
import { SpinBottle } from './components/SpinBottle';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateIcebreakerQuestions, generateTargetedQuestion } from './services/geminiService';
import { ContextType, ChaosLevel, FilterType, GeneratedQuestion, GameMode } from './types';

const generateSimpleId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  // State for Controls
  const [mode, setMode] = useState<GameMode>('list');
  const [context, setContext] = useState<ContextType>(ContextType.FirstDate);
  const [chaos, setChaos] = useState<ChaosLevel>(3);
  const [filters, setFilters] = useState<FilterType[]>([]);
  
  // State for Spin Mode
  const [players, setPlayers] = useState<string[]>([]);
  const [targetedQuestion, setTargetedQuestion] = useState<GeneratedQuestion | null>(null);

  // State for Data
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [savedQuestions, setSavedQuestions] = useLocalStorage<GeneratedQuestion[]>('icebreaker_saved', []);
  
  // State for UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);
  const targetedRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (f: FilterType) => {
    setFilters(prev => 
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const handleGenerateList = async () => {
    setIsLoading(true);
    setError(null);
    setTargetedQuestion(null); // Clear spin result if switching back
    
    try {
      const rawQuestions = await generateIcebreakerQuestions(context, chaos, filters);
      
      const newQuestions: GeneratedQuestion[] = rawQuestions.map(text => ({
        id: generateSimpleId(),
        text,
        context,
        chaosLevel: chaos,
        filters: [...filters],
        timestamp: Date.now()
      }));

      setQuestions(newQuestions);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinComplete = async (winner: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const questionText = await generateTargetedQuestion(winner, context, chaos, filters);
      
      const question: GeneratedQuestion = {
        id: generateSimpleId(),
        text: questionText,
        context,
        chaosLevel: chaos,
        filters: [...filters],
        timestamp: Date.now(),
        targetPerson: winner
      };

      setTargetedQuestion(question);

      setTimeout(() => {
        targetedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    } catch (err: any) {
       setError(err.message || "The bottle stalled.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSave = (question: GeneratedQuestion) => {
    const isAlreadySaved = savedQuestions.some(q => q.text === question.text);
    if (isAlreadySaved) {
      setSavedQuestions(prev => prev.filter(q => q.text !== question.text));
    } else {
      setSavedQuestions(prev => [question, ...prev]);
    }
  };

  const removeSaved = (id: string) => {
    setSavedQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <>
      <Background />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <ControlPanel 
            mode={mode}
            setMode={setMode}
            context={context}
            setContext={setContext}
            chaos={chaos}
            setChaos={setChaos}
            filters={filters}
            toggleFilter={toggleFilter}
            onGenerate={handleGenerateList}
            isLoading={isLoading}
          />

          {error && (
            <div role="alert" className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8 text-center animate-pulse flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* MODE: SPIN THE BOTTLE */}
          {mode === 'spin' && (
            <div className="animate-fadeIn">
              <SpinBottle 
                players={players} 
                setPlayers={setPlayers}
                onSpinComplete={handleSpinComplete}
                isLoading={isLoading}
              />
              
              <div ref={targetedRef}>
                {targetedQuestion && (
                  <div className="mt-8 animate-pop-in">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                        The Bottle Chose: {targetedQuestion.targetPerson}!
                      </h3>
                    </div>
                    <div className="max-w-xl mx-auto transform scale-105">
                      <QuestionCard 
                        question={targetedQuestion}
                        isSaved={savedQuestions.some(saved => saved.text === targetedQuestion.text)}
                        onToggleSave={toggleSave}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODE: LIST GENERATOR */}
          {mode === 'list' && (
            <section 
              ref={resultsRef} 
              className="scroll-mt-8 min-h-[200px]"
              aria-label="Generated Questions"
            >
              {questions.length === 0 && !isLoading && !error ? (
                /* Empty State */
                <div className="text-center p-12 border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-800/30 backdrop-blur-sm animate-fadeIn">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-slate-300 mb-2">Ready to break the ice?</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Select your context and chaos level above, then hit <strong className="text-slate-400">Generate</strong> to get some conversation starters.
                  </p>
                </div>
              ) : (
                /* Questions Grid */
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                  {questions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      isSaved={savedQuestions.some(saved => saved.text === q.text)}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Saved Questions */}
          <SavedList 
            savedQuestions={savedQuestions} 
            onRemove={removeSaved} 
          />
        </main>

        <footer className="mt-20 py-8 border-t border-slate-800 text-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Icebreaker Machine. Powered by Gemini.
          </p>
        </footer>
      </div>
    </>
  );
};

export default App;