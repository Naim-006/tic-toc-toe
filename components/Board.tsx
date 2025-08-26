
import React from 'react';
import { Square } from './Square';
import { Player, BoardState } from '../types';

interface BoardProps {
  board: BoardState;
  onSquareClick: (index: number) => void;
  winningLine: number[] | null;
}

export const Board: React.FC<BoardProps> = ({ board, onSquareClick, winningLine }) => {
  return (
    <div className="relative grid grid-cols-3 grid-rows-3 gap-2 bg-gray-900 p-2 rounded-lg neon-box">
      {/* Grid Lines */}
      <div className="absolute top-0 left-1/3 -ml-px w-1 h-full bg-cyan-400/50 neon-box"></div>
      <div className="absolute top-0 left-2/3 -ml-px w-1 h-full bg-cyan-400/50 neon-box"></div>
      <div className="absolute top-1/3 left-0 -mt-px w-full h-1 bg-cyan-400/50 neon-box"></div>
      <div className="absolute top-2/3 left-0 -mt-px w-full h-1 bg-cyan-400/50 neon-box"></div>
      
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinner={winningLine?.includes(index) ?? false}
        />
      ))}
    </div>
  );
};
