import React from 'react';
import { observer } from 'mobx-react-lite';
import gomokuStore from '../stores/gomoku';
import ShareGomokuModal from './ShareGomokuModal';

const GomokuGame: React.FC = observer(() => {
  const { 
    board, 
    currentPlayer, 
    winner, 
    placeStone, 
    resetGame,
    undoMove,
    moveHistory,
    isReplaying,
    isPaused,
    replayPosition,
    startReplay,
    pauseReplay,
    resumeReplay,
    setReplayPosition,
    showShareModal,
    toggleShareModal
  } = gomokuStore;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplayPosition(parseInt(e.target.value, 10));
  };

  return (
    <div style={{ 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Gomoku Game</h1>
      
      <div style={{ 
        marginBottom: '20px',
        padding: '10px 20px',
        backgroundColor: winner ? '#4CAF50' : '#2196F3',
        color: 'white',
        borderRadius: '4px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        {winner 
          ? `${winner === 'BLACK' ? 'Black' : 'White'} Wins!` 
          : `${currentPlayer === 'BLACK' ? 'Black' : 'White'}'s Turn`}
      </div>

      {/* Replay controls */}
      {(isReplaying || (winner && moveHistory.length > 0)) && (
        <div className="replay-controls" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '450px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            {winner && !isReplaying && (
              <button 
                className="replay-play-btn"
                onClick={startReplay}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ▶ Replay Game
              </button>
            )}
            {isReplaying && isPaused && (
              <button 
                className="replay-play-btn"
                onClick={resumeReplay}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ▶ Play
              </button>
            )}
            {isReplaying && !isPaused && (
              <button 
                className="replay-pause-btn"
                onClick={pauseReplay}
                style={{
                  backgroundColor: '#FFA500',
                  color: 'white',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ⏸ Pause
              </button>
            )}
          </div>
          
          {isReplaying && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px' }}>
                <span>0</span>
                <input
                  type="range"
                  className="replay-slider"
                  min="0"
                  max={moveHistory.length}
                  value={replayPosition}
                  onChange={handleSliderChange}
                  style={{ flex: 1 }}
                />
                <span>{moveHistory.length}</span>
              </div>
              
              <div className="current-move" style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                Move: {replayPosition} / {moveHistory.length}
              </div>
            </>
          )}
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
        <div style={{ 
          backgroundColor: '#DEB887', 
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(15, 30px)',
            gridTemplateRows: 'repeat(15, 30px)',
            gap: '0px'
          }}>
            {board.map((row, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {row.map((cell, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`chess-pos-${rowIndex}-${colIndex}`}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: 'transparent',
                      position: 'relative',
                      cursor: !cell && !winner && !isReplaying ? 'pointer' : 'default',
                      // Draw grid lines
                      boxSizing: 'border-box',
                      borderTop: rowIndex === 0 ? '1px solid #000' : '0px',
                      borderRight: colIndex === 14 ? '1px solid #000' : '0px',
                      borderBottom: rowIndex === 14 ? '1px solid #000' : '0px',
                      borderLeft: colIndex === 0 ? '1px solid #000' : '0px',
                      // Center line for every cell
                      backgroundImage: `
                        linear-gradient(to right, transparent 49.5%, black 49.5%, black 50.5%, transparent 50.5%),
                        linear-gradient(to bottom, transparent 49.5%, black 49.5%, black 50.5%, transparent 50.5%)
                      `,
                    }}
                    onClick={() => {
                      if (!cell && !winner && !isReplaying) {
                        placeStone(rowIndex, colIndex);
                      }
                    }}
                  >
                    {cell && (
                      <div
                        className={cell === 'BLACK' ? 'chess-black' : 'chess-white'}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: cell === 'BLACK' ? '#000' : '#fff',
                          position: 'absolute',
                          top: '3px',
                          left: '3px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          border: cell === 'WHITE' ? '1px solid #ccc' : 'none',
                          zIndex: 10
                        }}
                      />
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="move-history" style={{
          width: '200px',
          maxHeight: '450px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: 'white'
        }}>
          <h3 style={{ marginTop: 0, textAlign: 'center' }}>Move History</h3>
          {moveHistory.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666' }}>No moves yet</div>
          ) : (
            <div>
              {moveHistory.map((move, index) => (
                <div 
                  key={index} 
                  className="history-item"
                  style={{ 
                    padding: '5px',
                    borderBottom: '1px solid #eee',
                    fontSize: '14px',
                    color: move.player === 'BLACK' ? '#000' : '#666',
                    backgroundColor: isReplaying && index < replayPosition ? '#f0f0f0' : 'transparent'
                  }}
                >
                  {move.player === 'BLACK' ? 'Black' : 'White'}: ({move.row},{move.col})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={resetGame}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Reset Game
        </button>
        <button
          onClick={undoMove}
          disabled={moveHistory.length === 0 || isReplaying}
          style={{
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: moveHistory.length > 0 && !isReplaying ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            opacity: moveHistory.length > 0 && !isReplaying ? 1 : 0.5
          }}
        >
          Undo Move (Ctrl+Z)
        </button>
        {!isReplaying && moveHistory.length > 0 && !winner && (
          <button
            onClick={startReplay}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Replay Game
          </button>
        )}
        {winner && moveHistory.length > 0 && (
          <button
            className="share-to-blog-btn"
            onClick={toggleShareModal}
            style={{
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Share to Blog
          </button>
        )}
      </div>
      
      {showShareModal && <ShareGomokuModal />}
    </div>
  );
});

export default GomokuGame;