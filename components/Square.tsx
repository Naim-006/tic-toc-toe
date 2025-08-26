
import React from 'react';
import { Player } from '../types';

interface SquareProps {
  value: Player | null;
  onClick: () => void;
  isWinner: boolean;
}

export const Square: React.FC<SquareProps> = ({ value, onClick, isWinner }) => {
  const playerXClass = 'text-cyan-400 neon-text-cyan';
  const playerOClass = 'text-pink-500 neon-text-pink';

  const playerClass = value === Player.X ? playerXClass : playerOClass;
  const winnerClass = isWinner ? 'bg-white/20' : '';
  
  return (
    <button
      className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-6xl md:text-7xl font-bold transition-all duration-300 transform hover:scale-105 ${winnerClass}`}
      onClick={onClick}
      aria-label={`Square with value ${value || 'empty'}`}
    >
      <span className={playerClass}>{value}</span>
    </button>
  );
};
