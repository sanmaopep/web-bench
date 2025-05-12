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

import React, { useState } from 'react'
import useGameStore from '../stores/game'
import useBlogStore from '../stores/blog'
import { navigate } from '../stores/route'

const ShareGameModal = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { moveHistory, winner } = useGameStore()
  const { addBlog } = useBlogStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (title && description) {
      // Create blog post with the game data embedded
      const gameData = {
        moves: moveHistory,
        winner
      }
      
      // Format the blog content with the game data as JSON at the bottom
      const blogContent = `${description}\n\n<!-- GOMOKU_GAME_DATA\n${JSON.stringify(gameData)}\n-->`
      
      addBlog({ 
        title, 
        detail: blogContent 
      })
      
      onClose()
      navigate('/')
    }
  }

  return (
    <div 
      className="share-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        <h2 style={{ marginTop: '0' }}>Share Game to Blog</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '8px' }}>Title</label>
            <input
              id="title"
              type="text"
              className="title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '8px' }}>Description</label>
            <textarea
              id="description"
              className="description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                minHeight: '100px'
              }}
            />
          </div>
          <button
            type="submit"
            className="share-submit"
            disabled={!title || !description}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
              opacity: (!title || !description) ? 0.7 : 1
            }}
          >
            Share Game
          </button>
        </form>
      </div>
    </div>
  )
}

export default ShareGameModal