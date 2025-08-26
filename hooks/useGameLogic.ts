
import { useState, useCallback, useEffect } from 'react';
import { Player, BoardState, GameMode, GameState } from '../types';
import { INITIAL_BOARD, HUMAN_PLAYER, AI_PLAYER, WINNING_COMBINATIONS } from '../constants';
import { getAiMove } from '../services/geminiService';

const checkWinner = (board: BoardState): { winner: Player | 'tie' | null, line: number[] | null } => {
  for (const line of WINNING_COMBINATIONS) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: line };
    }
  }

  if (board.every(square => square !== null)) {
    return { winner: 'tie', line: null };
  }

  return { winner: null, line: null };
};

export const useGameLogic = (gameMode: GameMode, onGameEnd: (winner: Player | 'tie' | null) => void) => {
  const [gameState, setGameState] = useState<GameState>({
    board: [...INITIAL_BOARD],
    currentPlayer: Player.X,
    winner: null,
    winningLine: null,
    scores: { X: 0, O: 0, tie: 0 },
    isAiThinking: false,
  });

  const handleSquareClick = useCallback((index: number) => {
    if (gameState.board[index] || gameState.winner || gameState.isAiThinking) {
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const { winner, line } = checkWinner(newBoard);

    if (winner) {
      onGameEnd(winner);
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        winner: winner,
        winningLine: line,
        scores: {
          ...prev.scores,
          [winner]: prev.scores[winner as Player] + 1
        }
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === Player.X ? Player.O : Player.X,
      }));
    }
  }, [gameState, onGameEnd]);

  useEffect(() => {
    if (
      gameMode === GameMode.PlayerVsAi &&
      gameState.currentPlayer === AI_PLAYER &&
      !gameState.winner &&
      !gameState.isAiThinking
    ) {
      setGameState(prev => ({ ...prev, isAiThinking: true }));
      const makeAiMove = async () => {
        const move = await getAiMove(gameState.board);
        if (move !== null && gameState.board[move] === null) {
          handleSquareClick(move);
        } else if (move === null) {
            console.error("AI failed to make a move. This could be due to API key issues.");
        }
        setGameState(prev => ({ ...prev, isAiThinking: false }));
      };
      
      const aiThinkTime = 500 + Math.random() * 500;
      setTimeout(makeAiMove, aiThinkTime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentPlayer, gameState.winner, gameMode, gameState.board]);


  const resetRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      board: [...INITIAL_BOARD],
      currentPlayer: Player.X,
      winner: null,
      winningLine: null,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: [...INITIAL_BOARD],
      currentPlayer: Player.X,
      winner: null,
      winningLine: null,
      scores: { X: 0, O: 0, tie: 0 },
      isAiThinking: false,
    });
  }, []);

  return { gameState, handleSquareClick, resetRound, resetGame };
};
