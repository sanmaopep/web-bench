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

import { create } from 'zustand'

type CellValue = 'B' | 'W' | null;
type Board = CellValue[][];
type Player = 'B' | 'W';
type Move = { row: number; col: number; player: Player };

interface GameState {
  board: Board;
  replayBoard: Board;
  currentPlayer: Player;
  winner: Player | null;
  moveHistory: Move[];
  isReplaying: boolean;
  showReplayBoard: boolean;
  replayIndex: number;
  makeMove: (row: number, col: number) => void;
  undoMove: () => void;
  resetGame: () => void;
  startReplay: () => void;
  pauseReplay: () => void;
  setReplayIndex: (index: number) => void;
  incrementReplayIndex: () => void;
}

const createEmptyBoard = (): Board => {
  return Array(15).fill(null).map(() => Array(15).fill(null));
};

const checkWin = (board: Board, row: number, col: number, player: Player): boolean => {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down
    [1, -1],  // diagonal up
  ];

  for (const [dx, dy] of directions) {
    let count = 1;  // count the piece just placed

    // Check in positive direction
    for (let i = 1; i < 5; i++) {
      const newRow = row + i * dx;
      const newCol = col + i * dy;
      
      if (
        newRow >= 0 && newRow < 15 && 
        newCol >= 0 && newCol < 15 && 
        board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    // Check in negative direction
    for (let i = 1; i < 5; i++) {
      const newRow = row - i * dx;
      const newCol = col - i * dy;
      
      if (
        newRow >= 0 && newRow < 15 && 
        newCol >= 0 && newCol < 15 && 
        board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 5) {
      return true;
    }
  }

  return false;
};

const generateBoardFromMoves = (moves: Move[], upToIndex: number): Board => {
  const board = createEmptyBoard();
  for (let i = 0; i < upToIndex && i < moves.length; i++) {
    const move = moves[i];
    board[move.row][move.col] = move.player;
  }
  return board;
};

const useGameStore = create<GameState>((set, get) => ({
  board: createEmptyBoard(),
  replayBoard: createEmptyBoard(),
  currentPlayer: 'B',  // Black goes first
  winner: null,
  moveHistory: [],
  isReplaying: false,
  showReplayBoard: false,
  replayIndex: 0,
  
  makeMove: (row, col) => {
    const { board, currentPlayer, winner, moveHistory } = get();
    
    // If there's already a winner or the cell is occupied, do nothing
    if (winner || board[row][col] !== null) {
      return;
    }
    
    // Create a new board with the move
    const newBoard = board.map((boardRow, rowIndex) => 
      rowIndex === row 
        ? boardRow.map((cell, colIndex) => 
            colIndex === col ? currentPlayer : cell
          )
        : [...boardRow]
    );
    
    // Check if this move results in a win
    const isWinningMove = checkWin(newBoard, row, col, currentPlayer);

    // Add move to history
    const newMoveHistory = [...moveHistory, { row, col, player: currentPlayer }];
    
    set({
      board: newBoard,
      currentPlayer: currentPlayer === 'B' ? 'W' : 'B',
      winner: isWinningMove ? currentPlayer : null,
      moveHistory: newMoveHistory
    });
  },

  undoMove: () => {
    const { moveHistory, isReplaying } = get();
    
    if (moveHistory.length === 0 || isReplaying) {
      return;
    }
    
    // Create a new board by replaying moves except the last one
    const newHistory = moveHistory.slice(0, -1);
    const newBoard = createEmptyBoard();
    
    // Replay all moves except the last one
    newHistory.forEach(move => {
      newBoard[move.row][move.col] = move.player;
    });
    
    set({
      board: newBoard,
      currentPlayer: moveHistory[moveHistory.length - 1].player,
      winner: null,
      moveHistory: newHistory
    });
  },
  
  resetGame: () => {
    set({
      board: createEmptyBoard(),
      replayBoard: createEmptyBoard(),
      currentPlayer: 'B',
      winner: null,
      moveHistory: [],
      isReplaying: false,
      replayIndex: 0
    });
  },

  startReplay: () => {
    const { moveHistory } = get();
    
    if (moveHistory.length === 0) {
      return;
    }
    
    // Start replay from the beginning
    const initialReplayBoard = generateBoardFromMoves(moveHistory, 0);
    
    set({
      isReplaying: true,
      showReplayBoard: true,
      replayIndex: 0,
      replayBoard: initialReplayBoard
    });
  },

  pauseReplay: () => {
    set({ isReplaying: false });
  },

  setReplayIndex: (index) => {
    const { moveHistory } = get();
    const validIndex = Math.max(0, Math.min(index, moveHistory.length - 1));
    const newReplayBoard = generateBoardFromMoves(moveHistory, validIndex);
    
    set({
      replayIndex: validIndex,
      replayBoard: newReplayBoard
    });
  },

  incrementReplayIndex: () => {
    const { replayIndex, moveHistory } = get();
    
    if (replayIndex < moveHistory.length - 1) {
      const newIndex = replayIndex + 1;
      const newReplayBoard = generateBoardFromMoves(moveHistory, newIndex);
      
      set({
        replayIndex: newIndex,
        replayBoard: newReplayBoard
      });
    } else {
      // End of replay
      set({ isReplaying: false });
    }
  }
}));

export default useGameStore;