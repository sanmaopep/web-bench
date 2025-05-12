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
import useBlogStore from '../stores/blog'
import useUserStore from '../stores/user'
import useCommentStore from '../stores/comment'
import { markdownToHtml, sanitizeHtml } from '../utils/markdown'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import GameReplayModal from './GameReplayModal'

interface BlogProps {
  title: string
  detail: string
  author?: string
  selectedIndex: number
}

const Blog: React.FC<BlogProps> = ({ title, detail, author, selectedIndex }) => {
  const [showReplayModal, setShowReplayModal] = useState(false)
  const [gameData, setGameData] = useState<any>(null)
  const deleteBlog = useBlogStore((state) => state.deleteBlog)
  const { setFormVisible, setEditing, setSelectedBlogIndex } = useBlogStore()
  const { username } = useUserStore()

  // Check if blog contains game data
  useEffect(() => {
    const gameDataRegex = /<!-- GOMOKU_GAME_DATA\n([\s\S]*?)\n-->/
    const match = detail.match(gameDataRegex)
    
    if (match && match[1]) {
      try {
        const parsedData = JSON.parse(match[1])
        setGameData(parsedData)
      } catch (e) {
        console.error('Error parsing game data', e)
      }
    } else {
      setGameData(null)
    }
  }, [detail])

  const handleDelete = () => {
    deleteBlog(selectedIndex)
  }

  const handleEdit = () => {
    setFormVisible(true)
    setEditing(true)
    setSelectedBlogIndex(selectedIndex)
  }

  const handleReplayGame = () => {
    setShowReplayModal(true)
  }

  // Clean up content by removing the game data comment
  const cleanedContent = detail.replace(/<!-- GOMOKU_GAME_DATA\n[\s\S]*?\n-->/g, '')

  const canEditDelete = !author || (username && author === username)

  return (
    <div style={{ position: 'relative' }}>
      <h1 className="blog-title">{title}</h1>
      <div className="blog-author" style={{ marginBottom: '10px', fontStyle: 'italic' }}>
        By: {author || 'Anonymous'}
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(markdownToHtml(cleanedContent)),
        }}
        style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
      
      {gameData && (
        <div style={{ marginTop: '20px' }}>
          <button 
            className="blog-replay-btn"
            onClick={handleReplayGame}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Replay Game
          </button>
        </div>
      )}
      
      {canEditDelete && (
        <>
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
        </>
      )}
      <div style={{ marginTop: '20px' }}>
        <h3>Comments</h3>
        <CommentList blogId={selectedIndex} />
        <CommentForm blogId={selectedIndex} />
      </div>
      
      {showReplayModal && gameData && (
        <GameReplayModal gameData={gameData} onClose={() => setShowReplayModal(false)} />
      )}
    </div>
  )
}

export default Blog