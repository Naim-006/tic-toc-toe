
import { GoogleGenAI, Type } from "@google/genai";
import { BoardState, Player } from '../types';
import { AI_PLAYER, HUMAN_PLAYER } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI functionality will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    move: {
      type: Type.INTEGER,
      description: "The board index (0-8) for the AI's next move.",
    },
  },
  required: ["move"],
};

export const getAiMove = async (board: BoardState): Promise<number | null> => {
  if (!API_KEY) return null;

  const prompt = `
    You are an expert Tic-Tac-Toe AI player. Your mark is '${AI_PLAYER}'. The human player's mark is '${HUMAN_PLAYER}'.
    The game board is represented by a 9-element array. Index 0 is the top-left square, and index 8 is the bottom-right.
    A 'null' value means the square is empty.

    Current board state: [${board.map(p => p ? `"${p}"` : 'null').join(', ')}]

    It is your turn to move. Your goal is to win. If you cannot win, you must block the human player from winning. If neither is possible, make a valid strategic move.
    
    You must choose an index that is currently 'null'.
    
    Provide your answer as a JSON object with a single key "move" which is the index (0-8) of the square you choose.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 0 } // For low latency
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (typeof result.move === 'number' && result.move >= 0 && result.move <= 8) {
      if (board[result.move] === null) {
        return result.move;
      }
    }
    // Fallback if AI gives an invalid move
    throw new Error("AI returned an invalid move.");
  } catch (error) {
    console.error("Error getting AI move from Gemini:", error);
    // Fallback strategy: pick the first available spot
    const availableMoves = board
      .map((square, index) => (square === null ? index : null))
      .filter((index): index is number => index !== null);
    
    return availableMoves.length > 0 ? availableMoves[0] : null;
  }
};
