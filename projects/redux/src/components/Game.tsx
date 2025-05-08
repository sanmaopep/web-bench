import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Game.css';
import { placeChess, resetGame, undoMove, startReplay, pauseReplay, resumeReplay, replayNextMove, setReplayMoveIndex, shareGame } from '../models/game';
import { RootState } from '../store';
import ShareGameModal from './ShareGameModal';

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const { board, currentPlayer, winner, winningLine, moveHistory, isReplaying, replayPaused, replayMoveIndex, replayBoard } = gameState;
  const replayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const handlePlaceChess = (row: number, col: number) => {
    if (isReplaying || winner || board[row][col] !== null) return;
    dispatch(placeChess({ row, col }));
  };

  const handleResetGame = () => {
    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current);
      replayIntervalRef.current = null;
    }
    dispatch(resetGame());
  };

  const handleUndoMove = () => {
    dispatch(undoMove());
  };

  const handleStartReplay = () => {
    dispatch(startReplay());
  };

  const handlePauseReplay = () => {
    dispatch(pauseReplay());
  };

  const handleResumeReplay = () => {
    dispatch(resumeReplay());
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    dispatch(setReplayMoveIndex(value));
  };

  const handleOpenShareModal = () => {
    setShareModalVisible(true);
  };

  const handleCloseShareModal = () => {
    setShareModalVisible(false);
  };

  const handleShareGame = (title: string, description: string) => {
    dispatch(shareGame({ title, description, moveHistory }));
    setShareModalVisible(false);
  };

  useEffect(() => {
    if (isReplaying && !replayPaused) {
      // Clear any existing interval
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
      }
      
      // Set up a new interval
      replayIntervalRef.current = setInterval(() => {
        if (replayMoveIndex < moveHistory.length) {
          dispatch(replayNextMove());
        } else {
          // Clear interval when replay is finished
          if (replayIntervalRef.current) {
            clearInterval(replayIntervalRef.current);
            replayIntervalRef.current = null;
          }
          dispatch(pauseReplay());
        }
      }, 1000);
    } else if (replayPaused && replayIntervalRef.current) {
      // Pause replay by clearing interval
      clearInterval(replayIntervalRef.current);
      replayIntervalRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
      }
    };
  }, [isReplaying, replayPaused, replayMoveIndex, moveHistory.length, dispatch]);

  const renderDot = (row: number, col: number) => {
    // Star points (traditionally at 3-3, 3-11, 11-3, 11-11, and center)
    const starPoints = [
      [3, 3], [3, 7], [3, 11],
      [7, 3], [7, 7], [7, 11],
      [11, 3], [11, 7], [11, 11]
    ];

    if (starPoints.some(point => point[0] === row && point[1] === col)) {
      return <div className="dot"></div>;
    }
    return null;
  };

  const getStatusClass = () => {
    if (winner === 'BLACK') return 'black-wins';
    if (winner === 'WHITE') return 'white-wins';
    return currentPlayer === 'BLACK' ? 'black-turn' : 'white-turn';
  };

  const getStatusText = () => {
    if (winner) {
      return `${winner === 'BLACK' ? 'Black' : 'White'} Wins!`;
    }
    return `${currentPlayer === 'BLACK' ? 'Black' : 'White'}'s Turn`;
  };

  const renderBoard = () => {
    const currentBoard = isReplaying ? replayBoard : board;
    
    return (
      <div className="game-board">
        {currentBoard.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={`chess-position chess-pos-${rowIndex}-${colIndex}`}
              onClick={() => handlePlaceChess(rowIndex, colIndex)}
            >
              {renderDot(rowIndex, colIndex)}
              {cell && (
                <div className={`chess ${cell === 'BLACK' ? 'chess-black' : 'chess-white'}`}></div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Gomoku Game</h1>
      <div className={`game-status ${getStatusClass()}`}>
        {isReplaying ? 'Replaying Game' : getStatusText()}
      </div>
      <div className="game-area">
        {renderBoard()}
        <div className="move-history">
          <h3>Move History</h3>
          {moveHistory.length === 0 ? (
            <p>No moves yet</p>
          ) : (
            moveHistory.map((move, index) => (
              <div key={index} className="history-item">
                {move.player === 'BLACK' ? 'Black' : 'White'}: ({move.row},{move.col})
              </div>
            ))
          )}
        </div>
      </div>
      
      {winner && moveHistory.length > 0 && (
        <div className="replay-controls">
          <div className="replay-slider-container">
            <input 
              type="range"
              min="0"
              max={moveHistory.length}
              value={replayMoveIndex}
              onChange={handleSliderChange}
              className="replay-slider"
              disabled={!isReplaying}
            />
          </div>
          <div className="current-move">
            Move: {replayMoveIndex} / {moveHistory.length}
          </div>
          <div className="replay-buttons">
            {!isReplaying ? (
              <button 
                className="replay-play-btn" 
                onClick={handleStartReplay}
              >
                Play
              </button>
            ) : replayPaused ? (
              <button 
                className="replay-play-btn" 
                onClick={handleResumeReplay} 
                disabled={replayMoveIndex >= moveHistory.length}
              >
                Resume
              </button>
            ) : (
              <button 
                className="replay-pause-btn" 
                onClick={handlePauseReplay}
              >
                Pause
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="game-controls">
        <button 
          className="undo-button" 
          onClick={handleUndoMove}
          disabled={isReplaying || moveHistory.length === 0}
        >
          Undo Move
        </button>
        <button className="reset-button" onClick={handleResetGame}>
          Reset Game
        </button>
        {winner && (
          <button className="share-to-blog-btn" onClick={handleOpenShareModal}>
            Share to Blog
          </button>
        )}
      </div>

      {shareModalVisible && (
        <ShareGameModal 
          onClose={handleCloseShareModal}
          onSubmit={handleShareGame}
        />
      )}
    </div>
  );
};

export default Game;