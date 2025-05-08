import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { gameStateAtom, moveHistoryAtom, replayStateAtom, replayControlsAtom } from '../atoms/game';

interface GameReplayModalProps {
  onClose: () => void;
}

const GameReplayModal: React.FC<GameReplayModalProps> = ({ onClose }) => {
  const [gameState] = useAtom(gameStateAtom);
  const [moveHistory] = useAtom(moveHistoryAtom);
  const [replayState] = useAtom(replayStateAtom);
  const [, replayControls] = useAtom(replayControlsAtom);

  const intervalRef = useRef<number | null>(null);

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
    <div className="blog-replay-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h2 style={{ marginBottom: '20px' }}>Game Replay</h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: gameState.currentPlayer === 'black' ? '#333' : '#999',
          }}>
            <span className="current-move">
              Move: {replayState.currentMoveIndex} / {moveHistory.length}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(15, 25px)`,
            gridTemplateRows: `repeat(15, 25px)`,
            gap: '0px',
            backgroundColor: '#deb887',
            padding: '10px',
            borderRadius: '4px',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
          }}>
            {gameState.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`chess-pos-${rowIndex}-${colIndex}`}
                  className={`chess-pos-${rowIndex}-${colIndex}`}
                  style={{
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                      className={ cell === 'white' ? 'chess-white':'chess-black' }
                      style={{
                        width: '18px',
                        height: '18px',
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
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            justifyContent: 'center'
          }}>
            {replayState.isPlaying ? (
              <button 
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
                className="blog-replay-start-play"
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
                Play
              </button>
            )}
          </div>

          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>0</span>
            <input
              type="range"
              min={0}
              max={moveHistory.length}
              value={replayState.currentMoveIndex}
              onChange={handleSliderChange}
              style={{ flex: 1 }}
            />
            <span>{moveHistory.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameReplayModal;