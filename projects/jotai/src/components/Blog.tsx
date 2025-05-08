import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import {
  selectedBlogAtom,
  blogListAtom,
  editBlogAtom,
  formVisibleAtom,
  selectedBlogInfoAtom,
} from '../atoms/blog'
import { renderMarkdown } from '../utils/markdown'
import { userAtom } from '../atoms/user'
import Comments from './Comments'
import { undoCommentAtom } from '../atoms/comments'
import { gameStateAtom, moveHistoryAtom, replayControlsAtom, replayStateAtom, setGameFromHistoryAtom } from '../atoms/game'
import GameReplayModal from './GameReplayModal'

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useAtom(blogListAtom)
  const [user] = useAtom(userAtom)

  const [selectedBlog] = useAtom(selectedBlogInfoAtom)
  const [selectedIndex, setSelectedIndex] = useAtom(selectedBlogAtom)
  const [, setEditIndex] = useAtom(editBlogAtom)
  const [, setVisible] = useAtom(formVisibleAtom)
  const [, undoComment] = useAtom(undoCommentAtom)
  const [, setGameFromHistory] = useAtom(setGameFromHistoryAtom)
  
  const [isReplayModalOpen, setReplayModalOpen] = useState(false)

  const handleDelete = () => {
    const newBlogs = blogs.filter((_, i) => i !== selectedIndex)
    setBlogs(newBlogs)
    setSelectedIndex(newBlogs.length > 0 ? 0 : -1)
  }

  const handleEdit = () => {
    setEditIndex(selectedIndex)
    setVisible(true)
  }

  const canEditDelete = !selectedBlog?.author || selectedBlog?.author === user?.username

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+Z or Command+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undoComment();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoComment]);

  const handleReplayGame = () => {
    if (selectedBlog?.gameHistory) {
      setGameFromHistory(selectedBlog.gameHistory);
      setReplayModalOpen(true);
    }
  };

  const closeReplayModal = () => {
    setReplayModalOpen(false);
  };

  const hasGameHistory = selectedBlog?.gameHistory !== undefined;

  return (
    <div style={{ flex: 1, padding: '20px', position: 'relative' }}>
      {selectedBlog && canEditDelete && (
        <div
          style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}
        >
          <button
            className="edit-btn"
            onClick={handleEdit}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      )}
      {selectedBlog ? (
        <>
          <h1 className="blog-title">{selectedBlog.title}</h1>
          <div className="blog-author" style={{ marginBottom: '15px', color: '#666' }}>
            By: {selectedBlog.author || 'Anonymous'}
          </div>
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(selectedBlog.detail),
            }}
          />
          
          {hasGameHistory && (
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <button 
                className="blog-replay-btn"
                onClick={handleReplayGame}
                style={{
                  backgroundColor: '#673ab7',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🎮 Replay Game
              </button>
            </div>
          )}

          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />
          <Comments blogId={selectedIndex} />
        </>
      ) : (
        <div>No Blog</div>
      )}

      {isReplayModalOpen && <GameReplayModal onClose={closeReplayModal} />}
    </div>
  )
}

export default Blog