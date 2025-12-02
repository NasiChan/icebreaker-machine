import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        Icebreaker Machine 💬
      </h1>
      <p className="text-slate-400 mt-2 text-sm md:text-base">
        Icebreakers for dates, friends, and chaos moments.
      </p>
    </header>
  );
};