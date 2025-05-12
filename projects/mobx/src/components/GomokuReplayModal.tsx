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

import React from 'react'
import { observer } from 'mobx-react-lite'
import gomokuStore from '../stores/gomoku'

interface GomokuReplayModalProps {
  onClose: () => void
}

const GomokuReplayModal: React.FC<GomokuReplayModalProps> = observer(({ onClose }) => {
  const {
    board,
    moveHistory,
    winner,
    replayPosition,
    isReplaying,
    isPaused,
    startReplay,
    pauseReplay,
    resumeReplay,
    setReplayPosition,
  } = gomokuStore

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplayPosition(parseInt(e.target.value, 10))
  }

  React.useEffect(() => {
    // Clean up when modal closes
    return () => {
      gomokuStore.resetGame()
    }
  }, [])

  return (
    <div
      className="blog-replay-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          ×
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Game Replay{winner ? ` - ${winner === 'BLACK' ? 'Black' : 'White'} Won` : ''}
        </h2>

        <div
          className="replay-controls"
          style={{
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}
          >
            {!isReplaying && (
              <button
                className="blog-replay-start-play"
                onClick={startReplay}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ▶ Play
              </button>
            )}
            {isReplaying && isPaused && (
              <button
                className="blog-replay-resume"
                onClick={resumeReplay}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ▶ Play
              </button>
            )}
            {isReplaying && !isPaused && (
              <button
                className="blog-replay-pause"
                onClick={pauseReplay}
                style={{
                  backgroundColor: '#FFA500',
                  color: 'white',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ⏸ Pause
              </button>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: '400px',
              gap: '10px',
            }}
          >
            <span>0</span>
            <input
              type="range"
              min="0"
              max={moveHistory.length}
              value={replayPosition}
              onChange={handleSliderChange}
              style={{ flex: 1 }}
            />
            <span>{moveHistory.length}</span>
          </div>

          <div
            className="current-move"
            style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}
          >
            Move: {replayPosition} / {moveHistory.length}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#DEB887',
            padding: '10px',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            margin: '0 auto',
            width: 'fit-content',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(15, 30px)',
              gridTemplateRows: 'repeat(15, 30px)',
              gap: '0px',
            }}
          >
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
                          zIndex: 10,
                        }}
                      />
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

export default GomokuReplayModal
