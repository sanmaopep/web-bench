import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { shareModalAtom, toggleShareModalAtom, updateShareModalAtom } from '../atoms/game';
import { shareGameToBlogAtom } from '../atoms/blog';
import { moveHistoryAtom } from '../atoms/game';
import { navigateAtom } from '../atoms/route';

const ShareGameModal: React.FC = () => {
  const [shareModal, setShareModal] = useAtom(shareModalAtom);
  const [, toggleModal] = useAtom(toggleShareModalAtom);
  const [, updateShareModal] = useAtom(updateShareModalAtom);
  const [moveHistory] = useAtom(moveHistoryAtom);
  const [, shareGameToBlog] = useAtom(shareGameToBlogAtom);
  const [, navigate] = useAtom(navigateAtom);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateShareModal({ title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateShareModal({ description: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shareModal.title.trim()) {
      alert('Please enter a title for your game');
      return;
    }
    
    // Convert move history to string for storage
    const gameHistoryString = JSON.stringify(moveHistory);
    
    // Share the game
    shareGameToBlog({
      title: shareModal.title,
      description: shareModal.description,
      gameHistory: gameHistoryString
    });
    
    // Close modal and navigate to home
    toggleModal();
    navigate('/');
  };

  return (
    <div className="share-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: shareModal.isOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        position: 'relative'
      }}>
        <button 
          onClick={toggleModal}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '20px' }}>Share Game as Blog Post</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title</label>
            <input 
              className="title-input"
              id="title"
              type="text" 
              value={shareModal.title}
              onChange={handleTitleChange}
              placeholder="My Amazing Gomoku Game"
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ddd' 
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea 
              className="description-input"
              id="description"
              value={shareModal.description}
              onChange={handleDescriptionChange}
              placeholder="Tell others about your game strategy..."
              style={{ 
                width: '100%', 
                height: '100px', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ddd' 
              }}
            />
          </div>
          <button 
            type="submit"
            className="share-submit"
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              float: 'right'
            }}
          >
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShareGameModal;