import React, { useState, useEffect, useRef } from 'react'
import useGameStore from '../stores/game'
import ShareGameModal from './ShareGameModal'

const Game = () => {
  const {
    board,
    currentPlayer,
    winner,
    makeMove,
    undoMove,
    moveHistory,
    resetGame,
    isReplaying,
    replayIndex,
    startReplay,
    pauseReplay,
    setReplayIndex,
    replayBoard,
    showReplayBoard,
  } = useGameStore()

  const [showShareModal, setShowShareModal] = useState(false)
  const replayIntervalRef = useRef<number | null>(null)

  const isGameFinished = Boolean(winner)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undoMove()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undoMove])

  useEffect(() => {
    if (isReplaying && replayIndex < moveHistory.length) {
      replayIntervalRef.current = window.setInterval(() => {
        useGameStore.getState().incrementReplayIndex()

        if (useGameStore.getState().replayIndex >= moveHistory.length) {
          clearInterval(replayIntervalRef.current as number)
        }
      }, 1000)
    }

    return () => {
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current)
      }
    }
  }, [isReplaying, replayIndex, moveHistory.length])

  const handleReplayPlay = () => {
    startReplay()
  }

  const handleReplayPause = () => {
    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current)
    }
    pauseReplay()
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value, 10)
    setReplayIndex(newIndex)
  }

  const handleNewGame = () => {
    resetGame()
    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current)
    }
  }

  const handleShareGame = () => {
    setShowShareModal(true)
  }

  const displayBoard = showReplayBoard ? replayBoard : board

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: '#f5f5f5',
      }}
    >
      <h1 style={{ marginBottom: '20px', color: '#1a365d' }}>Gomoku Game</h1>

      {winner ? (
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: winner === 'B' ? '#333' : '#f5f5f5',
            backgroundColor: winner === 'B' ? '#f5f5f5' : '#333',
            padding: '10px 20px',
            borderRadius: '8px',
          }}
        >
          {winner === 'B' ? 'Black Wins!' : 'White Wins!'}
        </div>
      ) : (
        <div
          style={{
            fontSize: '20px',
            marginBottom: '20px',
            color: currentPlayer === 'B' ? '#333' : '#f5f5f5',
            backgroundColor: currentPlayer === 'B' ? '#f5f5f5' : '#333',
            padding: '8px 16px',
            borderRadius: '8px',
          }}
        >
          {currentPlayer === 'B' ? "Black's Turn" : "White's Turn"}
        </div>
      )}

      <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(15, 30px)',
            gridTemplateRows: 'repeat(15, 30px)',
            gap: '0px',
            backgroundColor: '#DCB35C',
            padding: '15px',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          {displayBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`chess-pos-${rowIndex}-${colIndex}`}
                onClick={() =>
                  !winner && !isReplaying && cell === null && makeMove(rowIndex, colIndex)
                }
                style={{
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  cursor: cell === null && !winner && !isReplaying ? 'pointer' : 'default',
                }}
              >
                {/* Grid lines */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#333',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                  }}
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: '100%',
                    backgroundColor: '#333',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1,
                  }}
                ></div>

                {/* Chess pieces */}
                {cell && (
                  <div
                    className={`chess-${cell === 'B' ? 'black' : 'white'}`}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: cell === 'B' ? '#000' : '#fff',
                      boxShadow:
                        cell === 'B'
                          ? 'inset 2px 2px 5px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)'
                          : 'inset 2px 2px 5px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.3)',
                      zIndex: 2,
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>

        <div
          className="move-history"
          style={{
            maxHeight: '400px',
            overflow: 'auto',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            width: '180px',
          }}
        >
          <h3>Move History</h3>
          {moveHistory.length === 0 ? (
            <div>No moves yet</div>
          ) : (
            <div>
              {moveHistory.map((move, index) => (
                <div
                  key={index}
                  className="history-item"
                  style={{
                    padding: '5px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                    fontWeight: isReplaying && index === replayIndex ? 'bold' : 'normal',
                  }}
                >
                  {`${move.player === 'B' ? 'Black' : 'White'}: (${move.row},${move.col})`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isGameFinished && (
        <div style={{ marginBottom: '20px', width: '400px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <button
              className="replay-play-btn"
              onClick={handleReplayPlay}
              disabled={isReplaying}
              style={{
                padding: '10px 20px',
                backgroundColor: isReplaying ? '#cccccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isReplaying ? 'default' : 'pointer',
                fontSize: '16px',
              }}
            >
              ▶ Play
            </button>

            {showReplayBoard && (
              <>
                <button
                  className="replay-pause-btn"
                  onClick={handleReplayPause}
                  disabled={!isReplaying}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: !isReplaying ? '#cccccc' : '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: !isReplaying ? 'default' : 'pointer',
                    fontSize: '16px',
                  }}
                >
                  ⏸ Pause
                </button>

                <span className="current-move" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {replayIndex}
                </span>
              </>
            )}
          </div>

          {showReplayBoard && (
            <input
              type="range"
              className="replay-slider"
              min="0"
              max={moveHistory.length - 1}
              value={replayIndex}
              onChange={handleSliderChange}
              style={{ width: '100%' }}
            />
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={undoMove}
          disabled={moveHistory.length === 0 || isReplaying}
          style={{
            padding: '10px 20px',
            backgroundColor: moveHistory.length === 0 || isReplaying ? '#cccccc' : '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: moveHistory.length === 0 || isReplaying ? 'default' : 'pointer',
            fontSize: '16px',
          }}
        >
          Undo (Ctrl+Z)
        </button>

        <button
          onClick={handleNewGame}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          New Game
        </button>

        {isGameFinished && (
          <button
            onClick={handleShareGame}
            className="share-to-blog-btn"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Share to Blog
          </button>
        )}
      </div>

      {showShareModal && <ShareGameModal onClose={() => setShowShareModal(false)} />}
    </div>
  )
}

export default Game
