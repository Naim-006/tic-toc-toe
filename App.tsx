
import React, { useState, useCallback, useMemo } from 'react';
import { Board } from './components/Board';
import { SettingsModal } from './components/SettingsModal';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { useGameLogic } from './hooks/useGameLogic';
import { useAudio } from './hooks/useAudio';
import { GameMode, GameScreen, Player, Settings } from './types';
import { HUMAN_PLAYER } from './constants';

const MainMenu: React.FC<{ onStartGame: (mode: GameMode) => void; onOpenSettings: () => void }> = ({ onStartGame, onOpenSettings }) => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-cyan-400 mb-2 neon-text-cyan">TIC</h1>
        <h1 className="text-6xl md:text-8xl font-bold text-pink-500 mb-12 neon-text-pink">TAC</h1>
        <h1 className="text-6xl md:text-8xl font-bold text-cyan-400 mb-16 neon-text-cyan">TOE</h1>
        <div className="space-y-6 w-full max-w-xs">
            <button onClick={() => onStartGame(GameMode.PlayerVsAi)} className="w-full bg-cyan-500/20 border-2 border-cyan-500 text-cyan-300 py-4 rounded-lg font-bold text-2xl transition-all duration-300 hover:bg-cyan-500/40 hover:text-white neon-box transform hover:scale-105">
                Player vs AI
            </button>
            <button onClick={() => onStartGame(GameMode.PlayerVsPlayer)} className="w-full bg-pink-500/20 border-2 border-pink-500 text-pink-300 py-4 rounded-lg font-bold text-2xl transition-all duration-300 hover:bg-pink-500/40 hover:text-white neon-box-pink transform hover:scale-105">
                Two Players
            </button>
        </div>
        <button onClick={onOpenSettings} className="absolute top-4 right-4 text-cyan-400 hover:text-white transition-colors duration-300">
            <SettingsIcon className="w-8 h-8" />
        </button>
    </div>
);

const GameHeader: React.FC<{ 
    scores: { X: number; O: number; tie: number },
    currentPlayer: Player,
    winner: Player | 'tie' | null,
    isAiThinking: boolean,
    gameMode: GameMode
}> = ({ scores, currentPlayer, winner, isAiThinking, gameMode }) => {
    
    const getStatusText = () => {
        if (winner) {
            if (winner === 'tie') return "IT'S A TIE!";
            const winnerText = gameMode === GameMode.PlayerVsAi ? (winner === HUMAN_PLAYER ? 'YOU WIN!' : 'AI WINS!') : `PLAYER ${winner} WINS!`;
            return winnerText;
        }
        if (isAiThinking) return "AI IS THINKING...";
        const turnText = gameMode === GameMode.PlayerVsAi ? (currentPlayer === HUMAN_PLAYER ? 'YOUR TURN' : 'AI TURN') : `PLAYER ${currentPlayer}'S TURN`;
        return turnText;
    };

    const statusColor = winner 
        ? (winner === Player.X ? 'text-cyan-400 neon-text-cyan' : winner === Player.O ? 'text-pink-500 neon-text-pink' : 'text-gray-400')
        : (currentPlayer === Player.X ? 'text-cyan-400' : 'text-pink-500');

    return (
        <div className="w-full max-w-md mx-auto mb-6 text-center">
            <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-cyan-500/50">
                <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">X</div>
                    <div className="text-xl text-white">{scores.X}</div>
                </div>
                 <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">TIE</div>
                    <div className="text-xl text-white">{scores.tie}</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-pink-500">O</div>
                    <div className="text-xl text-white">{scores.O}</div>
                </div>
            </div>
            <div className={`mt-4 text-2xl font-bold transition-colors duration-300 h-8 ${statusColor}`}>
                {getStatusText()}
            </div>
        </div>
    );
};

const GameScreenComponent: React.FC<{ 
    gameMode: GameMode, 
    onBackToMenu: () => void,
    onOpenSettings: () => void,
    settings: Settings
}> = ({ gameMode, onBackToMenu, onOpenSettings, settings }) => {
    
    const playClickSound = useAudio(settings.sound);
    const playWinSound = useAudio(settings.sound);

    const onGameEnd = useCallback((winner: Player | 'tie' | null) => {
        if(winner && winner !== 'tie') {
            playWinSound();
            if (settings.vibration) navigator.vibrate?.(200);
        }
    }, [playWinSound, settings.vibration]);
    
    const { gameState, handleSquareClick, resetRound, resetGame } = useGameLogic(gameMode, onGameEnd);
    
    const onSquareClick = (index: number) => {
        const board = gameState.board;
        if (!board[index] && !gameState.winner) {
            playClickSound();
            if (settings.vibration) navigator.vibrate?.(50);
            handleSquareClick(index);
        }
    }

    const handleResetGame = () => {
        resetGame();
        onBackToMenu();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <GameHeader 
                scores={gameState.scores}
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                isAiThinking={gameState.isAiThinking}
                gameMode={gameMode}
            />
            
            <Board 
                board={gameState.board} 
                onSquareClick={onSquareClick}
                winningLine={gameState.winningLine}
            />

            <div className="mt-8 flex items-center space-x-4">
                {gameState.winner && (
                    <button onClick={resetRound} className="px-6 py-2 text-lg font-bold text-cyan-300 border-2 border-cyan-500 rounded-md neon-box hover:bg-cyan-500/20 transition-colors">
                        Next Round
                    </button>
                )}
                <button onClick={handleResetGame} className="px-6 py-2 text-lg font-bold text-pink-300 border-2 border-pink-500 rounded-md neon-box-pink hover:bg-pink-500/20 transition-colors">
                    Main Menu
                </button>
            </div>

            <button onClick={onOpenSettings} className="absolute top-4 right-4 text-cyan-400 hover:text-white transition-colors duration-300">
                <SettingsIcon className="w-8 h-8" />
            </button>
        </div>
    );
};


export default function App() {
  const [screen, setScreen] = useState<GameScreen>(GameScreen.Menu);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PlayerVsAi);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    music: false,
    sound: true,
    vibration: true,
  });

  // NOTE: Placeholder for background music
  useMemo(() => {
    if (settings.music) {
        console.log("Background music is ON (simulation).");
    } else {
        console.log("Background music is OFF (simulation).");
    }
  }, [settings.music]);

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setScreen(GameScreen.Game);
  };

  const backToMenu = () => {
    setScreen(GameScreen.Menu);
  };
  
  return (
    <main className="bg-gray-900 text-white min-h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.3),rgba(255,255,255,0))]"></div>
        <div className="relative z-10 h-screen">
            {screen === GameScreen.Menu && <MainMenu onStartGame={startGame} onOpenSettings={() => setIsSettingsOpen(true)} />}
            {screen === GameScreen.Game && <GameScreenComponent gameMode={gameMode} onBackToMenu={backToMenu} onOpenSettings={() => setIsSettingsOpen(true)} settings={settings} />}
        </div>
        {isSettingsOpen && <SettingsModal settings={settings} onSettingsChange={setSettings} onClose={() => setIsSettingsOpen(false)} />}
    </main>
  );
}
