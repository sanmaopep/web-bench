import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import gomokuStore from '../stores/gomoku';
import blogStore from '../stores/blog';
import userStore from '../stores/user';
import routeStore from '../stores/route';

const ShareGomokuModal: React.FC = observer(() => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    // Check for duplicate title
    const isDuplicate = blogStore.blogs.some(blog => blog.title === title);
    if (isDuplicate) {
      setError('A blog with this title already exists');
      return;
    }
    
    // Create a blog post with the game data embedded
    const gameData = {
      moveHistory: gomokuStore.moveHistory,
      winner: gomokuStore.winner
    };
    
    // Create markdown with game data embedded as JSON
    const gameDataJson = JSON.stringify(gameData);
    const markdown = `${description}\n\n<!-- GOMOKU_GAME_DATA\n${gameDataJson}\n-->\n\n*Click the Replay Game button above to watch the game.*`;
    
    blogStore.addBlog({
      title: title,
      detail: markdown,
      author: userStore.isLoggedIn ? userStore.username : 'Anonymous'
    });
    
    // Navigate to home and select the new blog
    routeStore.navigate('/');
    blogStore.selectBlog(blogStore.blogs.length - 1);
    
    // Close the modal
    gomokuStore.toggleShareModal();
  };

  return (
    <div 
      className="share-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '500px',
          maxWidth: '90%'
        }}
      >
        <h2 style={{ marginTop: 0 }}>Share Gomoku Game to Blog</h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
          )}
          
          <div style={{ marginBottom: '15px' }}>
            <label 
              htmlFor="title" 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold' 
              }}
            >
              Blog Title
            </label>
            <input
              id="title"
              className="title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label 
              htmlFor="description" 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold' 
              }}
            >
              Game Description
            </label>
            <textarea
              id="description"
              className="description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
              placeholder="Describe your game strategy or interesting moments..."
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => gomokuStore.toggleShareModal()}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="share-submit"
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ShareGomokuModal;