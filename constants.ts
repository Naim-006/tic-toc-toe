
import { Player, type BoardState } from './types';

export const INITIAL_BOARD: BoardState = Array(9).fill(null);
export const HUMAN_PLAYER = Player.X;
export const AI_PLAYER = Player.O;

export const WINNING_COMBINATIONS = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];
