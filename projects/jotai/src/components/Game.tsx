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

import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { gameStateAtom, resetGameAtom, placePieceAtom, undoMoveAtom, moveHistoryAtom, replayStateAtom, replayControlsAtom, toggleShareModalAtom } from '../atoms/game';
import { navigateAtom } from '../atoms/route';
import ShareGameModal from './ShareGameModal';

const Game: React.FC = () => {
  const [gameState] = useAtom(gameStateAtom);
  const [moveHistory] = useAtom(moveHistoryAtom);
  const [replayState] = useAtom(replayStateAtom);
  const [, resetGame] = useAtom(resetGameAtom);
  const [, placePiece] = useAtom(placePieceAtom);
  const [, navigate] = useAtom(navigateAtom);
  const [, undoMove] = useAtom(undoMoveAtom);
  const [, replayControls] = useAtom(replayControlsAtom);
  const [, toggleShareModal] = useAtom(toggleShareModalAtom);

  const intervalRef = useRef<number | null>(null);

  const handleCellClick = (row: number, col: number) => {
    placePiece({ row, col });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+Z or Command+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoMove();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoMove]);

  // Replay interval management
  useEffect(() => {
    if (replayState.isReplaying && replayState.isPlaying) {
      // Clear any existing interval
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }

      // Set up interval for auto-advancing moves
      intervalRef.current = window.setInterval(() => {
        const nextMoveIndex = replayState.currentMoveIndex + 1;
        
        if (nextMoveIndex <= moveHistory.length) {
          replayControls({ type: 'setMove', moveIndex: nextMoveIndex });
        } else {
          // We've reached the end of the replay
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          replayControls({ type: 'pause' });
        }
      }, 1000);
    } else if (intervalRef.current !== null) {
      // Clear interval when replay is paused
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Cleanup interval when component unmounts
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [replayState.isReplaying, replayState.isPlaying, replayState.currentMoveIndex, moveHistory.length, replayControls]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const moveIndex = parseInt(e.target.value, 10);
    replayControls({ type: 'setMove', moveIndex });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '600px',
        marginBottom: '20px',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1a365d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Blog
        </button>
        <div>
          {!replayState.isReplaying && (
            <>
              <button
                onClick={() => undoMove()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  opacity: moveHistory.length > 0 ? 1 : 0.5,
                  pointerEvents: moveHistory.length > 0 ? 'auto' : 'none',
                }}
              >
                Undo (Ctrl+Z)
              </button>
              <button
                onClick={() => resetGame()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                New Game
              </button>
            </>
          )}
        </div>
      </div>

      <h1 style={{ color: '#1a365d', marginBottom: '20px' }}>Gomoku Game</h1>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1000px',
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}>
          {gameState.status === 'playing' ? (
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: gameState.currentPlayer === 'black' ? '#333' : '#999',
              textAlign: 'center',
            }}>
              {replayState.isReplaying ? (
                <span className="current-move">
                  Move: {replayState.currentMoveIndex} / {moveHistory.length}
                </span>
              ) : (
                <span>
                  {gameState.currentPlayer === 'black' ? "Black's Turn" : "White's Turn"}
                </span>
              )}
            </div>
          ) : gameState.status === 'win' ? (
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: gameState.winner === 'black' ? '#333' : '#999',
              textAlign: 'center',
            }}>
              {gameState.winner === 'black' ? "Black Wins!" : "White Wins!"}
            </div>
          ) : (
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#666',
              textAlign: 'center',
            }}>
              Draw!
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(15, 30px)`,
            gridTemplateRows: `repeat(15, 30px)`,
            gap: '0px',
            backgroundColor: '#deb887', // Burlywood color for the board
            padding: '10px',
            borderRadius: '4px',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
          }}>
            {gameState.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`chess-pos-${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: gameState.status === 'playing' && !cell && !replayState.isReplaying ? 'pointer' : 'default',
                    position: 'relative',
                    backgroundColor: 'transparent',
                  }}
                >
                  {/* Horizontal grid lines */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#000',
                    top: '50%',
                    zIndex: 1,
                  }} />
                  
                  {/* Vertical grid lines */}
                  <div style={{
                    position: 'absolute',
                    width: '1px',
                    height: '100%',
                    backgroundColor: '#000',
                    left: '50%',
                    zIndex: 1,
                  }} />
                  
                  {cell && (
                    <div
                      className={cell === 'black' ? 'chess-black' : 'chess-white'}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: cell === 'black' ? '#000' : '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        border: cell === 'white' ? '1px solid #ccc' : 'none',
                        zIndex: 2,
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
          
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-around',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#000',
              }} />
              <span>Black</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
              }} />
              <span>White</span>
            </div>
          </div>

          {gameState.status !== 'playing' && !replayState.isReplaying && (
            <div style={{ 
              marginTop: '15px', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <button 
                className="replay-play-btn"
                onClick={() => replayControls({ type: 'start' })}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#673ab7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Replay Game
              </button>
              
              <button 
                className="share-to-blog-btn"
                onClick={toggleShareModal}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Share to Blog
              </button>
            </div>
          )}

          {replayState.isReplaying && (
            <div style={{ 
              marginTop: '15px', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '10px'
              }}>
                {replayState.isPlaying ? (
                  <button 
                    className="replay-pause-btn"
                    onClick={() => replayControls({ type: 'pause' })}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#673ab7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Pause
                  </button>
                ) : (
                  <button 
                    className="replay-play-btn"
                    onClick={() => replayControls({ type: 'play' })}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#673ab7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Play
                  </button>
                )}
                <button 
                  onClick={() => replayControls({ type: 'stop' })}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Exit Replay
                </button>
              </div>

              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>0</span>
                <input
                  type="range"
                  className="replay-slider"
                  min={0}
                  max={moveHistory.length}
                  value={replayState.currentMoveIndex}
                  onChange={handleSliderChange}
                  style={{ flex: 1 }}
                />
                <span>{moveHistory.length}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="move-history" style={{
          width: '250px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          maxHeight: '500px',
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Move History</h3>
          {moveHistory.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>No moves yet</p>
          ) : (
            <div>
              {moveHistory.map((move, index) => (
                <div 
                  key={index} 
                  className="history-item"
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: replayState.isReplaying && replayState.currentMoveIndex === index + 1 ? '#e3f2fd' : 'transparent',
                  }}
                >
                  <div 
                    style={{
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      backgroundColor: move.player === 'black' ? '#000' : '#fff',
                      border: move.player === 'white' ? '1px solid #ccc' : 'none',
                    }}
                  />
                  <span>
                    {move.player.charAt(0).toUpperCase() + move.player.slice(1)}: ({move.row},{move.col})
                  </span>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
            <p>Press Ctrl+Z (or Cmd+Z on Mac) to undo a move</p>
          </div>
        </div>
      </div>
      
      <ShareGameModal />
    </div>
  );
};

export default Game;