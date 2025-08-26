
export enum Player {
  X = 'X',
  O = 'O',
}

export type BoardState = (Player | null)[];

export enum GameMode {
  PlayerVsPlayer = 'PVP',
  PlayerVsAi = 'PVA',
}

export enum GameScreen {
  Menu = 'MENU',
  Game = 'GAME',
}

export interface Settings {
  music: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  winner: Player | 'tie' | null;
  winningLine: number[] | null;
  scores: { [key in Player]: number } & { tie: number };
  isAiThinking: boolean;
}
