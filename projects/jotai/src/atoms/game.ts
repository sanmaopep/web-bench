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

import { atom } from 'jotai';

export type Player = 'black' | 'white';
export type CellState = Player | null;
export type BoardState = CellState[][];
export type GameStatus = 'playing' | 'win' | 'draw';

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  moveCount: number;
}

export interface MoveHistory {
  row: number;
  col: number;
  player: Player;
}

export interface ReplayState {
  isReplaying: boolean;
  isPlaying: boolean;
  currentMoveIndex: number;
}

export interface ShareModalState {
  isOpen: boolean;
  title: string;
  description: string;
}

const BOARD_SIZE = 15;
const WIN_COUNT = 5;

// Initialize an empty board
const createEmptyBoard = (): BoardState => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
};

const initialGameState: GameState = {
  board: createEmptyBoard(),
  currentPlayer: 'black', // Black goes first
  status: 'playing',
  winner: null,
  moveCount: 0,
};

const initialReplayState: ReplayState = {
  isReplaying: false,
  isPlaying: false,
  currentMoveIndex: 0,
};

const initialShareModalState: ShareModalState = {
  isOpen: false,
  title: '',
  description: ''
};

export const gameStateAtom = atom<GameState>(initialGameState);
export const moveHistoryAtom = atom<MoveHistory[]>([]);
export const replayStateAtom = atom<ReplayState>(initialReplayState);
export const shareModalAtom = atom<ShareModalState>(initialShareModalState);

export const resetGameAtom = atom(
  null,
  (get, set) => {
    set(gameStateAtom, initialGameState);
    set(moveHistoryAtom, []);
    set(replayStateAtom, initialReplayState);
  }
);

export const toggleShareModalAtom = atom(
  null,
  (get, set) => {
    const currentState = get(shareModalAtom);
    set(shareModalAtom, {
      ...currentState,
      isOpen: !currentState.isOpen
    });
  }
);

export const updateShareModalAtom = atom(
  null,
  (get, set, payload: {title?: string, description?: string}) => {
    const currentState = get(shareModalAtom);
    set(shareModalAtom, {
      ...currentState,
      ...payload
    });
  }
);

// Check if there's a win after placing a piece
const checkWin = (board: BoardState, row: number, col: number, player: Player): boolean => {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1],  // diagonal down-left
  ];

  for (const [dx, dy] of directions) {
    let count = 1; // Count the piece just placed

    // Check in positive direction
    for (let i = 1; i < WIN_COUNT; i++) {
      const r = row + i * dx;
      const c = col + i * dy;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) {
        break;
      }
      count++;
    }

    // Check in negative direction
    for (let i = 1; i < WIN_COUNT; i++) {
      const r = row - i * dx;
      const c = col - i * dy;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) {
        break;
      }
      count++;
    }

    if (count >= WIN_COUNT) {
      return true;
    }
  }

  return false;
};

export const placePieceAtom = atom(
  null,
  (get, set, payload: { row: number; col: number }) => {
    const { row, col } = payload;
    const gameState = get(gameStateAtom);
    const replayState = get(replayStateAtom);
    
    // Do nothing if the game is already over or the cell is occupied or in replay mode
    if (gameState.status !== 'playing' || gameState.board[row][col] !== null || replayState.isReplaying) {
      return;
    }

    // Create a deep copy of the board
    const newBoard = gameState.board.map(row => [...row]);
    
    // Place the piece
    newBoard[row][col] = gameState.currentPlayer;
    
    // Check for win
    const isWin = checkWin(newBoard, row, col, gameState.currentPlayer);
    
    // Update move count
    const newMoveCount = gameState.moveCount + 1;
    
    // Check for draw (board is full)
    const isDraw = newMoveCount >= BOARD_SIZE * BOARD_SIZE;

    // Determine next player
    const nextPlayer: Player = gameState.currentPlayer === 'black' ? 'white' : 'black';
    
    // Update game state
    set(gameStateAtom, {
      board: newBoard,
      currentPlayer: isWin ? gameState.currentPlayer : nextPlayer,
      status: isWin ? 'win' : (isDraw ? 'draw' : 'playing'),
      winner: isWin ? gameState.currentPlayer : null,
      moveCount: newMoveCount,
    });
    
    // Add to move history
    const moveHistory = get(moveHistoryAtom);
    set(moveHistoryAtom, [...moveHistory, {
      row,
      col,
      player: gameState.currentPlayer
    }]);
  }
);

export const undoMoveAtom = atom(
  null,
  (get, set) => {
    const moveHistory = get(moveHistoryAtom);
    const replayState = get(replayStateAtom);
    
    // Don't allow undo in replay mode
    if (replayState.isReplaying) {
      return;
    }
    
    if (moveHistory.length === 0) {
      return;
    }

    // Remove the last move
    const newHistory = [...moveHistory];
    newHistory.pop();
    set(moveHistoryAtom, newHistory);

    // Reconstruct the board from the remaining history
    const newBoard = createEmptyBoard();
    newHistory.forEach(move => {
      newBoard[move.row][move.col] = move.player;
    });
    
    // Determine next player (opposite of the last player in history)
    const currentPlayer = newHistory.length > 0 
      ? (newHistory[newHistory.length - 1].player === 'black' ? 'white' : 'black')
      : 'black';
    
    // Reset game state to playing since we're undoing
    set(gameStateAtom, {
      board: newBoard,
      currentPlayer,
      status: 'playing',
      winner: null,
      moveCount: newHistory.length,
    });
  }
);

export const replayControlsAtom = atom(
  null,
  (get, set, action: { type: 'start' | 'stop' | 'play' | 'pause' | 'setMove'; moveIndex?: number }) => {
    const moveHistory = get(moveHistoryAtom);
    const currentReplayState = get(replayStateAtom);
    
    switch (action.type) {
      case 'start':
        // Start replay from beginning
        set(replayStateAtom, {
          isReplaying: true,
          isPlaying: true,
          currentMoveIndex: 0
        });
        
        // Reset board
        const newBoard = createEmptyBoard();
        set(gameStateAtom, {
          board: newBoard,
          currentPlayer: 'black',
          status: 'playing',
          winner: null,
          moveCount: 0,
        });
        break;
        
      case 'stop':
        // Exit replay mode and restore the final game state
        const finalBoard = createEmptyBoard();
        moveHistory.forEach(move => {
          finalBoard[move.row][move.col] = move.player;
        });
        
        const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
        const finalPlayer = lastMove ? (lastMove.player === 'black' ? 'white' : 'black') : 'black';
        
        // Determine final game status
        let status: GameStatus = 'playing';
        let winner: Player | null = null;
        
        if (moveHistory.length > 0) {
          const lastMove = moveHistory[moveHistory.length - 1];
          if (checkWin(finalBoard, lastMove.row, lastMove.col, lastMove.player)) {
            status = 'win';
            winner = lastMove.player;
          } else if (moveHistory.length >= BOARD_SIZE * BOARD_SIZE) {
            status = 'draw';
          }
        }
        
        set(gameStateAtom, {
          board: finalBoard,
          currentPlayer: finalPlayer,
          status,
          winner,
          moveCount: moveHistory.length,
        });
        
        set(replayStateAtom, initialReplayState);
        break;
        
      case 'play':
        set(replayStateAtom, {
          ...currentReplayState,
          isPlaying: true
        });
        break;
        
      case 'pause':
        set(replayStateAtom, {
          ...currentReplayState,
          isPlaying: false
        });
        break;
        
      case 'setMove':
        if (typeof action.moveIndex === 'number') {
          // Validate move index
          const validIndex = Math.max(0, Math.min(action.moveIndex, moveHistory.length));
          
          // Reconstruct board up to this move
          const newBoard = createEmptyBoard();
          for (let i = 0; i < validIndex; i++) {
            const move = moveHistory[i];
            newBoard[move.row][move.col] = move.player;
          }
          
          // Determine current player and game status
          const currentPlayer = validIndex > 0 && validIndex < moveHistory.length
            ? (moveHistory[validIndex - 1].player === 'black' ? 'white' : 'black')
            : 'black';
          
          let status: GameStatus = 'playing';
          let winner: Player | null = null;
          
          // Check if the last played move resulted in a win
          if (validIndex > 0) {
            const lastMove = moveHistory[validIndex - 1];
            if (checkWin(newBoard, lastMove.row, lastMove.col, lastMove.player)) {
              status = 'win';
              winner = lastMove.player;
            } else if (validIndex >= BOARD_SIZE * BOARD_SIZE) {
              status = 'draw';
            }
          }
          
          set(gameStateAtom, {
            board: newBoard,
            currentPlayer,
            status,
            winner,
            moveCount: validIndex,
          });
          
          set(replayStateAtom, {
            ...currentReplayState,
            currentMoveIndex: validIndex
          });
        }
        break;
    }
  }
);

export const setGameFromHistoryAtom = atom(
  null,
  (get, set, historyString: string) => {
    try {
      const moveHistory: MoveHistory[] = JSON.parse(historyString);
      set(moveHistoryAtom, moveHistory);
      
      // Set up the final board state
      const finalBoard = createEmptyBoard();
      moveHistory.forEach(move => {
        finalBoard[move.row][move.col] = move.player;
      });
      
      const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
      const finalPlayer = lastMove ? (lastMove.player === 'black' ? 'white' : 'black') : 'black';
      
      // Determine final game status
      let status: GameStatus = 'playing';
      let winner: Player | null = null;
      
      if (moveHistory.length > 0) {
        const lastMove = moveHistory[moveHistory.length - 1];
        if (checkWin(finalBoard, lastMove.row, lastMove.col, lastMove.player)) {
          status = 'win';
          winner = lastMove.player;
        } else if (moveHistory.length >= BOARD_SIZE * BOARD_SIZE) {
          status = 'draw';
        }
      }
      
      set(gameStateAtom, {
        board: finalBoard,
        currentPlayer: finalPlayer,
        status,
        winner,
        moveCount: moveHistory.length,
      });
    } catch (error) {
      console.error("Error parsing game history:", error);
    }
  }
);