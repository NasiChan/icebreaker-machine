import React, { useState, useEffect, useRef } from 'react';

interface SpinBottleProps {
  players: string[];
  setPlayers: (p: string[]) => void;
  onSpinComplete: (winner: string) => void;
  isLoading: boolean;
}

export const SpinBottle: React.FC<SpinBottleProps> = ({ players, setPlayers, onSpinComplete, isLoading }) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newPlayerName.trim();
    if (name && !players.includes(name) && players.length < 12) {
      setPlayers([...players, name]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (name: string) => {
    setPlayers(players.filter(p => p !== name));
  };

  const spin = () => {
    if (players.length < 2 || isSpinning || isLoading) return;

    setIsSpinning(true);
    
    // 1. Pick a random winner index
    const winnerIndex = Math.floor(Math.random() * players.length);
    const winnerName = players[winnerIndex];

    // 2. Calculate angles
    // The bottle points UP at 0deg. 
    // We want to rotate it so it points to the winner.
    // Segment size
    const segmentDeg = 360 / players.length;
    // Target angle relative to the start of the circle (top)
    // We want the bottle to point to the MIDDLE of the segment
    // But CSS rotation goes clockwise. 
    // If player 0 is at top (0deg), player 1 is at 360/N deg.
    const targetAngle = winnerIndex * segmentDeg;
    
    // Add 5-8 full spins (1800 - 2880 deg) + target
    // We actually want to land ON the target angle, so we need to account for current rotation
    const fullSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const finalRotation = rotation + fullSpins + (targetAngle - (rotation % 360));

    setRotation(finalRotation);

    // 3. Wait for animation to finish then notify parent
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(winnerName);
    }, 4000); // Must match CSS transition duration
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl mb-10 text-center">
      
      {/* Player Input Section */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
          Add Participants (2-12)
        </h2>
        <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4 justify-center max-w-sm mx-auto">
          <input 
            type="text" 
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Name..."
            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-pink-500 outline-none"
            maxLength={15}
            disabled={isSpinning || isLoading}
          />
          <button 
            type="submit"
            disabled={!newPlayerName.trim() || players.length >= 12 || isSpinning || isLoading}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
          >
            Add
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2 min-h-[40px]">
          {players.map(p => (
            <span key={p} className="inline-flex items-center gap-1 bg-pink-900/30 text-pink-300 px-3 py-1 rounded-full text-sm border border-pink-500/20 animate-pop-in">
              {p}
              {!isSpinning && !isLoading && (
                <button onClick={() => handleRemovePlayer(p)} className="hover:text-pink-100 ml-1">×</button>
              )}
            </span>
          ))}
          {players.length === 0 && <span className="text-slate-500 text-sm italic">No players added yet.</span>}
        </div>
      </div>

      {/* The Arena */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto my-8 flex items-center justify-center">
        {/* Circle of Players */}
        {players.map((player, i) => {
          const angle = (360 / players.length) * i;
          // Position logic: standard trig to place items on circle edge
          // Center is 50%, 50%. Radius is approx 40-45%.
          const radius = 42; // percentage
          // -90 to start at top (12 o'clock) for 0 deg
          const x = 50 + radius * Math.cos(((angle - 90) * Math.PI) / 180);
          const y = 50 + radius * Math.sin(((angle - 90) * Math.PI) / 180);

          return (
            <div 
              key={player + i}
              className="absolute text-xs md:text-sm font-bold text-slate-300 whitespace-nowrap px-2 py-1 bg-slate-900/80 rounded-md border border-slate-700 shadow-sm transition-all"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%)`,
                zIndex: 1
              }}
            >
              {player}
            </div>
          );
        })}

        {/* The Bottle */}
        <div 
          className="relative w-full h-full flex items-center justify-center z-10 transition-transform cubic-bezier(0.25, 0.1, 0.25, 1)"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '4000ms' : '500ms'
          }}
        >
          {/* SVG Bottle */}
          <div className="w-16 h-40 md:w-20 md:h-48 relative -mt-10 filter drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform origin-bottom">
               <path d="M30 190H70V140C70 140 90 120 90 80V50H10V80C10 120 30 140 30 140V190Z" fill="#be185d" fillOpacity="0.8" stroke="#fbcfe8" strokeWidth="4"/>
               <rect x="35" y="10" width="30" height="40" fill="#fbcfe8"/>
               <path d="M50 0L35 10H65L50 0Z" fill="#fbcfe8"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={spin}
        disabled={players.length < 2 || isSpinning || isLoading}
        className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform focus:outline-none ${
          players.length < 2 || isSpinning || isLoading
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-900/50 hover:-translate-y-1 hover:scale-105 active:scale-95'
        }`}
      >
        {isSpinning ? 'Spinning...' : isLoading ? 'Reading Mind...' : '🍾 SPIN IT!'}
      </button>

    </div>
  );
};