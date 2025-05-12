// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { navigate } from '../middleware/route';
import { addBlog } from './blog';

type CellState = 'BLACK' | 'WHITE' | null;
type Player = 'BLACK' | 'WHITE';

export interface Move {
  row: number;
  col: number;
  player: Player;
}

export interface GameState {
  board: CellState[][];
  currentPlayer: Player;
  winner: Player | null;
  winningLine: [number, number][] | null;
  moveHistory: Move[];
  isReplaying: boolean;
  replayPaused: boolean;
  replayMoveIndex: number;
  replayBoard: CellState[][];
}

const initialState: GameState = {
  board: Array(15).fill(null).map(() => Array(15).fill(null)),
  currentPlayer: 'BLACK',
  winner: null,
  winningLine: null,
  moveHistory: [],
  isReplaying: false,
  replayPaused: false,
  replayMoveIndex: 0,
  replayBoard: Array(15).fill(null).map(() => Array(15).fill(null))
};

// Check if there's a winner after a move
const checkWinner = (board: CellState[][], row: number, col: number, player: Player): [number, number][] | null => {
  const directions = [
    [1, 0],   // horizontal
    [0, 1],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1]   // diagonal down-left
  ];

  for (const [dx, dy] of directions) {
    let count = 1;
    const line: [number, number][] = [[row, col]];

    // Check forward
    for (let i = 1; i <= 4; i++) {
      const newRow = row + i * dx;
      const newCol = col + i * dy;
      if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15 || board[newRow][newCol] !== player) {
        break;
      }
      count++;
      line.push([newRow, newCol]);
    }

    // Check backward
    for (let i = 1; i <= 4; i++) {
      const newRow = row - i * dx;
      const newCol = col - i * dy;
      if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15 || board[newRow][newCol] !== player) {
        break;
      }
      count++;
      line.unshift([newRow, newCol]);
    }

    if (count >= 5) {
      return line;
    }
  }

  return null;
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    placeChess: (state, action: PayloadAction<{row: number, col: number}>) => {
      const { row, col } = action.payload;
      
      // Can't place if there's already a winner or if the cell is occupied
      if (state.winner || state.board[row][col] !== null) {
        return;
      }
      
      // Place the chess
      state.board[row][col] = state.currentPlayer;
      
      // Add to move history
      state.moveHistory.push({
        row,
        col,
        player: state.currentPlayer
      });
      
      // Check for a winner
      const winningLine = checkWinner(state.board, row, col, state.currentPlayer);
      if (winningLine) {
        state.winner = state.currentPlayer;
        state.winningLine = winningLine;
      } else {
        // Switch players if no winner
        state.currentPlayer = state.currentPlayer === 'BLACK' ? 'WHITE' : 'BLACK';
      }
    },
    undoMove: (state) => {
      if (state.moveHistory.length === 0) {
        return;
      }
      
      // Remove the last move
      const lastMove = state.moveHistory.pop();
      if (lastMove) {
        // Clear the cell
        state.board[lastMove.row][lastMove.col] = null;
        
        // Reset winner status if there was a winner
        state.winner = null;
        state.winningLine = null;
        
        // Set the current player to the player who made the last move
        state.currentPlayer = lastMove.player;
      }
    },
    resetGame: (state) => {
      state.board = Array(15).fill(null).map(() => Array(15).fill(null));
      state.currentPlayer = 'BLACK';
      state.winner = null;
      state.winningLine = null;
      state.moveHistory = [];
      state.isReplaying = false;
      state.replayPaused = false;
      state.replayMoveIndex = 0;
      state.replayBoard = Array(15).fill(null).map(() => Array(15).fill(null));
    },
    startReplay: (state) => {
      state.isReplaying = true;
      state.replayPaused = false;
      state.replayMoveIndex = 0;
      state.replayBoard = Array(15).fill(null).map(() => Array(15).fill(null));
    },
    pauseReplay: (state) => {
      state.replayPaused = true;
    },
    resumeReplay: (state) => {
      state.replayPaused = false;
    },
    replayNextMove: (state) => {
      if (state.replayMoveIndex < state.moveHistory.length) {
        const move = state.moveHistory[state.replayMoveIndex];
        state.replayBoard[move.row][move.col] = move.player;
        state.replayMoveIndex++;
      } else {
        state.isReplaying = false;
      }
    },
    setReplayMoveIndex: (state, action: PayloadAction<number>) => {
      const newIndex = Math.min(Math.max(0, action.payload), state.moveHistory.length);
      state.replayMoveIndex = newIndex;
      
      // Reconstruct the board up to this move
      state.replayBoard = Array(15).fill(null).map(() => Array(15).fill(null));
      for (let i = 0; i < newIndex; i++) {
        const move = state.moveHistory[i];
        state.replayBoard[move.row][move.col] = move.player;
      }
    },
    shareGame: (state, action: PayloadAction<{title: string, description: string, moveHistory: Move[]}>) => {
      // This is a thunk action that will be handled in the extraReducers
      // The actual implementation is in the middleware
    }
  }
});

export const { 
  placeChess, 
  undoMove, 
  resetGame,
  startReplay,
  pauseReplay,
  resumeReplay,
  replayNextMove,
  setReplayMoveIndex,
  shareGame
} = gameSlice.actions;
export default gameSlice.reducer;