import React from 'react'
import { observer } from 'mobx-react-lite'
import blogStore from '../stores/blog'
import userStore from '../stores/user'
import gomokuStore from '../stores/gomoku'
import { renderMarkdown } from '../utils/markdown'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import GomokuReplayModal from './GomokuReplayModal'

interface BlogProps {
  title: string
  detail: string
  author?: string
}

const Blog: React.FC<BlogProps> = observer(({ title, detail, author }) => {
  const isAuthor = userStore.isLoggedIn && userStore.username === author;
  const [showReplayModal, setShowReplayModal] = React.useState(false);
  
  const handleDelete = () => {
    blogStore.blogs.splice(blogStore.selectedBlogIndex, 1)
    if (blogStore.blogs.length > 0) {
      blogStore.selectBlog(0)
    }
  }

  const handleEdit = () => {
    blogStore.setEditMode(true)
    blogStore.toggleForm()
  }

  // Check if blog contains Gomoku game data
  const hasGomokuGame = detail.includes('<!-- GOMOKU_GAME_DATA');
  
  // Extract game data for replay
  const extractGameData = () => {
    if (!hasGomokuGame) return null;
    
    const start = detail.indexOf('<!-- GOMOKU_GAME_DATA\n') + '<!-- GOMOKU_GAME_DATA\n'.length;
    const end = detail.indexOf('\n-->', start);
    
    if (start > 0 && end > start) {
      try {
        const jsonData = detail.substring(start, end);
        return JSON.parse(jsonData);
      } catch (e) {
        console.error('Error parsing Gomoku game data:', e);
      }
    }
    return null;
  };
  
  const handleReplayGame = () => {
    const gameData = extractGameData();
    if (gameData) {
      gomokuStore.loadGameFromData(gameData);
      setShowReplayModal(true);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {(isAuthor || !author) && (
        <>
          <button 
            className="delete-btn"
            onClick={handleDelete}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
          <button 
            className="edit-btn"
            onClick={handleEdit}
            style={{
              position: 'absolute',
              top: 0,
              right: 60,
            }}
          >
            Edit
          </button>
        </>
      )}
      <h2 className="blog-title">{title}</h2>
      <p className="blog-author" style={{ color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
        By: {author || 'Anonymous'}
      </p>
      
      {/* Replay button for Gomoku games */}
      {hasGomokuGame && (
        <button
          className="blog-replay-btn"
          onClick={handleReplayGame}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '15px',
            display: 'block'
          }}
        >
          Replay Game
        </button>
      )}
      
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(detail.replace(/<!-- GOMOKU_GAME_DATA\n[\s\S]*?\n-->/g, '')) }} />
      
      <div style={{ 
        marginTop: '30px', 
        paddingTop: '20px',
        borderTop: '1px solid #eee'
      }}>
        <CommentList blogId={blogStore.selectedBlogIndex} />
        <CommentForm blogId={blogStore.selectedBlogIndex} />
      </div>
      
      {showReplayModal && (
        <GomokuReplayModal onClose={() => setShowReplayModal(false)} />
      )}
    </div>
  )
})

export default Blog