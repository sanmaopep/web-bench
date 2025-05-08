import { makeAutoObservable, action, observable } from 'mobx';

type Player = 'BLACK' | 'WHITE';
type Cell = Player | null;
type Board = Cell[][];

interface Move {
  row: number;
  col: number;
  player: Player;
}

class GomokuStore {
  board: Board = Array(15).fill(null).map(() => Array(15).fill(null));
  currentPlayer: Player = 'BLACK';
  winner: Player | null = null;
  moveHistory: Move[] = [];
  
  // Replay related state
  isReplaying: boolean = false;
  isPaused: boolean = true;
  replayPosition: number = 0;
  replayTimer: NodeJS.Timeout | null = null;

  showShareModal: boolean = false;

  constructor() {
    makeAutoObservable(this, {
      replayTimer: false // Don't observe the timer
    });
    this.registerUndoHandler();
  }

  registerUndoHandler() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        this.undoMove();
        e.preventDefault();
      }
    });
  }

  toggleShareModal = action(() => {
    this.showShareModal = !this.showShareModal;
  });

  placeStone = action((row: number, col: number) => {
    if (this.board[row][col] === null && !this.winner && !this.isReplaying) {
      this.board[row][col] = this.currentPlayer;
      
      // Record the move
      this.moveHistory.push({
        row,
        col,
        player: this.currentPlayer
      });
      
      if (this.checkWin(row, col)) {
        this.winner = this.currentPlayer;
      } else {
        // Switch player
        this.currentPlayer = this.currentPlayer === 'BLACK' ? 'WHITE' : 'BLACK';
      }
    }
  });

  undoMove = action(() => {
    if (this.moveHistory.length === 0 || this.isReplaying) return;
    
    // Get the last move
    const lastMove = this.moveHistory.pop();
    if (!lastMove) return;
    
    // Clear the board position
    this.board[lastMove.row][lastMove.col] = null;
    
    // Reset winner state if there was a winner
    if (this.winner) {
      this.winner = null;
    }
    
    // Set current player to the player who made the last move
    this.currentPlayer = lastMove.player;
  });

  resetGame = action(() => {
    this.stopReplay();
    this.board = Array(15).fill(null).map(() => Array(15).fill(null));
    this.currentPlayer = 'BLACK';
    this.winner = null;
    this.moveHistory = [];
    this.replayPosition = 0;
  });

  startReplay = action(() => {
    if (this.moveHistory.length === 0) return;
    
    // Reset the board first
    this.board = Array(15).fill(null).map(() => Array(15).fill(null));
    this.replayPosition = 0;
    this.isReplaying = true;
    this.isPaused = false;
    this.currentPlayer = 'BLACK';
    this.winner = null;
    
    this.replayTimer = setTimeout(() => this.advanceReplay(), 1000);
  });

  advanceReplay = action(() => {
    if (this.isPaused || this.replayPosition >= this.moveHistory.length) {
      if (this.replayPosition >= this.moveHistory.length) {
        // Check for winner at the end of replay
        const lastMove = this.moveHistory[this.moveHistory.length - 1];
        if (this.checkWin(lastMove.row, lastMove.col)) {
          this.winner = lastMove.player;
        }
      }
      return;
    }

    // Play the next move
    const move = this.moveHistory[this.replayPosition];
    this.board[move.row][move.col] = move.player;
    this.currentPlayer = move.player === 'BLACK' ? 'WHITE' : 'BLACK';
    this.replayPosition++;

    // Schedule the next move
    if (this.replayPosition < this.moveHistory.length) {
      this.replayTimer = setTimeout(() => this.advanceReplay(), 1000);
    } else if (this.replayPosition === this.moveHistory.length) {
      // Check for winner at the end of replay
      const lastMove = this.moveHistory[this.moveHistory.length - 1];
      if (this.checkWin(lastMove.row, lastMove.col)) {
        this.winner = lastMove.player;
      }
    }
  });

  pauseReplay = action(() => {
    if (this.replayTimer) {
      clearTimeout(this.replayTimer);
      this.replayTimer = null;
    }
    this.isPaused = true;
  });

  resumeReplay = action(() => {
    if (this.isReplaying && this.isPaused && this.replayPosition < this.moveHistory.length) {
      this.isPaused = false;
      this.advanceReplay();
    }
  });

  stopReplay = action(() => {
    if (this.replayTimer) {
      clearTimeout(this.replayTimer);
      this.replayTimer = null;
    }
    this.isReplaying = false;
    this.isPaused = true;
    this.replayPosition = 0;
  });

  setReplayPosition = action((position: number) => {
    if (!this.isReplaying || position < 0 || position > this.moveHistory.length) return;
    
    // Pause any ongoing replay
    if (this.replayTimer) {
      clearTimeout(this.replayTimer);
      this.replayTimer = null;
    }
    
    // Clear the board
    this.board = Array(15).fill(null).map(() => Array(15).fill(null));
    
    // Replay up to the new position
    for (let i = 0; i < position; i++) {
      const move = this.moveHistory[i];
      this.board[move.row][move.col] = move.player;
    }
    
    this.replayPosition = position;
    
    // Set the current player based on whose turn would be next
    if (position === 0) {
      this.currentPlayer = 'BLACK';
      this.winner = null;
    } else {
      const lastMove = this.moveHistory[position - 1];
      this.currentPlayer = lastMove.player === 'BLACK' ? 'WHITE' : 'BLACK';
      
      // Check if this position is a winning position
      if (this.checkWin(lastMove.row, lastMove.col)) {
        this.winner = lastMove.player;
      } else {
        this.winner = null;
      }
    }
  });

  checkWin(row: number, col: number): boolean {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
    ];
    
    const player = this.board[row][col];
    if (!player) return false;
    
    for (const [dx, dy] of directions) {
      let count = 1;
      
      // Check in positive direction
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        
        if (
          newRow >= 0 && newRow < 15 && 
          newCol >= 0 && newCol < 15 && 
          this.board[newRow][newCol] === player
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
          this.board[newRow][newCol] === player
        ) {
          count++;
        } else {
          break;
        }
      }
      
      // If we found 5 in a row
      if (count >= 5) {
        return true;
      }
    }
    
    return false;
  }

  // Add this method to the GomokuStore class
  loadGameFromData = action((gameData: any) => {
    // Reset the game first
    this.resetGame();
    
    // Set replay mode
    this.isReplaying = false;
    this.isPaused = true;
    
    // Load the move history
    if (gameData.moveHistory && Array.isArray(gameData.moveHistory)) {
      this.moveHistory = gameData.moveHistory;
    }
    
    // Set the winner if available
    if (gameData.winner) {
      this.winner = gameData.winner;
    }
    
    // Initialize the board up to the first move
    this.replayPosition = 0;
    this.applyMovesToBoard();
  });
  
  // This helper method updates the board state based on the replay position
  applyMovesToBoard = action(() => {
    // Clear the board
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        this.board[i][j] = null;
      }
    }
    
    // Apply moves up to the replay position
    for (let i = 0; i < this.replayPosition; i++) {
      const move = this.moveHistory[i];
      if (move && typeof move.row === 'number' && typeof move.col === 'number') {
        this.board[move.row][move.col] = move.player;
      }
    }
  });
}

const gomokuStore = new GomokuStore();
export default gomokuStore;