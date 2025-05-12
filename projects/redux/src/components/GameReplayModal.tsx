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

import React, { useState, useEffect, useRef } from 'react';
import './GameReplayModal.css';
import { Move } from '../models/game';

interface GameReplayModalProps {
  moveHistory: Move[];
  onClose: () => void;
}

const GameReplayModal: React.FC<GameReplayModalProps> = ({ moveHistory, onClose }) => {
  const [board, setBoard] = useState<Array<Array<'BLACK' | 'WHITE' | null>>>(
    Array(15).fill(null).map(() => Array(15).fill(null))
  );
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartPlay = () => {
    if (currentMoveIndex >= moveHistory.length) {
      // Reset the board if we're at the end
      setBoard(Array(15).fill(null).map(() => Array(15).fill(null)));
      setCurrentMoveIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        setCurrentMoveIndex(prev => {
          if (prev < moveHistory.length) {
            // Update board with the next move
            const move = moveHistory[prev];
            setBoard(prevBoard => {
              const newBoard = prevBoard.map(row => [...row]);
              newBoard[move.row][move.col] = move.player;
              return newBoard;
            });
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, moveHistory]);

  const renderDot = (row: number, col: number) => {
    const starPoints = [
      [3, 3], [3, 7], [3, 11],
      [7, 3], [7, 7], [7, 11],
      [11, 3], [11, 7], [11, 11]
    ];

    if (starPoints.some(point => point[0] === row && point[1] === col)) {
      return <div className="blog-replay-dot"></div>;
    }
    return null;
  };

  return (
    <div className="blog-replay-modal">
      <div className="blog-replay-content">
        <div className="blog-replay-header">
          <h2 className="blog-replay-title">Game Replay</h2>
          <button className="blog-replay-close" onClick={onClose}>×</button>
        </div>
        
        <div className="blog-replay-board">
          {board.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`chess-position chess-pos-${rowIndex}-${colIndex}`}
              >
                {renderDot(rowIndex, colIndex)}
                {cell && (
                  <div className={`blog-replay-chess ${cell === 'BLACK' ? 'chess-black' : 'chess-white'}`}></div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="current-move">
          Move: {currentMoveIndex} / {moveHistory.length}
        </div>
        
        <div className="blog-replay-controls">
          {!isPlaying ? (
            <button 
              className="blog-replay-start-play" 
              onClick={handleStartPlay}
            >
              {currentMoveIndex >= moveHistory.length ? 'Restart' : 'Play'}
            </button>
          ) : (
            <button 
              className="blog-replay-pause" 
              onClick={handlePause}
            >
              Pause
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameReplayModal;