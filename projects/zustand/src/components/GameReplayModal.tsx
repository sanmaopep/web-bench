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

import React, { useState, useEffect, useRef } from 'react'

interface Move {
  row: number
  col: number
  player: 'B' | 'W'
}

interface GameData {
  moves: Move[]
  winner: 'B' | 'W' | null
}

interface GameReplayModalProps {
  gameData: GameData
  onClose: () => void
}

const GameReplayModal: React.FC<GameReplayModalProps> = ({ gameData, onClose }) => {
  const [board, setBoard] = useState<Array<Array<'B' | 'W' | null>>>(
    Array(15).fill(null).map(() => Array(15).fill(null))
  )
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<number | null>(null)
  
  // Reset board when game data changes
  useEffect(() => {
    setBoard(Array(15).fill(null).map(() => Array(15).fill(null)))
    setCurrentMoveIndex(-1)
    setIsPlaying(false)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [gameData])
  
  // Update board when currentMoveIndex changes
  useEffect(() => {
    const newBoard = Array(15).fill(null).map(() => Array(15).fill(null))
    
    for (let i = 0; i <= currentMoveIndex && i < gameData.moves.length; i++) {
      const move = gameData.moves[i]
      newBoard[move.row][move.col] = move.player
    }
    
    setBoard(newBoard)
  }, [currentMoveIndex, gameData.moves])
  
  // Handle auto-play
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentMoveIndex(prev => {
          const nextIndex = prev + 1
          if (nextIndex >= gameData.moves.length) {
            setIsPlaying(false)
            return prev
          }
          return nextIndex
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, gameData.moves.length])
  
  const handleStartPlay = () => {
    if (currentMoveIndex >= gameData.moves.length - 1) {
      // Reset if at the end
      setCurrentMoveIndex(-1)
    }
    setIsPlaying(true)
  }
  
  const handlePausePlay = () => {
    setIsPlaying(false)
  }
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value, 10)
    setCurrentMoveIndex(newIndex)
    setIsPlaying(false)
  }
  
  return (
    <div 
      className="blog-replay-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
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
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        
        <h2 style={{ marginTop: '0', marginBottom: '20px', textAlign: 'center' }}>Game Replay</h2>
        
        {gameData.winner && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '15px',
            fontWeight: 'bold',
            fontSize: '18px',
            color: gameData.winner === 'B' ? '#000' : '#666'
          }}>
            Winner: {gameData.winner === 'B' ? 'Black' : 'White'}
          </div>
        )}
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(15, 30px)',
          gridTemplateRows: 'repeat(15, 30px)',
          gap: '0px',
          backgroundColor: '#DCB35C',
          padding: '15px',
          margin: '0 auto 20px auto',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`chess-pos-${rowIndex}-${colIndex}`}
                style={{
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
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
                />
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
                />

                {/* Chess pieces */}
                {cell && (
                  <div
                    className={`chess-${cell === 'B' ? 'black' : 'white'} chess-pos-${rowIndex}-${colIndex}`}
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
        
        <div style={{ 
          width: '450px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '100%',
            marginBottom: '10px'
          }}>
            <button
              className="blog-replay-start-play"
              onClick={handleStartPlay}
              disabled={isPlaying}
              style={{
                padding: '10px 20px',
                backgroundColor: isPlaying ? '#cccccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isPlaying ? 'default' : 'pointer',
              }}
            >
              ▶ Play
            </button>
            
            <button
              onClick={handlePausePlay}
              disabled={!isPlaying}
              style={{
                padding: '10px 20px',
                backgroundColor: !isPlaying ? '#cccccc' : '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: !isPlaying ? 'default' : 'pointer',
              }}
            >
              ⏸ Pause
            </button>
            
            <div className="current-move" style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}>
              Move: {currentMoveIndex + 1} / {gameData.moves.length}
            </div>
          </div>
          
          <input
            type="range"
            min="-1"
            max={gameData.moves.length - 1}
            value={currentMoveIndex}
            onChange={handleSliderChange}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}

export default GameReplayModal