import React, { useState } from 'react';
import './Blog.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog } from '../models/blog';
import { openEditForm } from '../models/blogForm';
import { parseMarkdown } from '../utils/markdown';
import { RootState } from '../store';
import Comments from './Comments';
import GameReplayModal from './GameReplayModal';

interface BlogProps {
  title: string;
  detail: string;
  author?: string;
  id: number;
}

const Blog: React.FC<BlogProps> = ({ title, detail, author, id }) => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.user.username);
  const currentUser = useSelector((state: RootState) => state.user.username);
  const [replayModalVisible, setReplayModalVisible] = useState(false);

  const handleDelete = () => {
    dispatch(deleteBlog());
  };

  const handleEdit = () => {
    dispatch(openEditForm());
  };

  const showEditControls = !author || author === currentUser;

  // Check if this blog contains a game recording
  const gameData = useSelector((state: RootState) => {
    const blog = state.blog.blogs[id];
    if (blog && blog.gameData) {
      return blog.gameData;
    }
    return null;
  });

  const handleOpenReplayModal = () => {
    setReplayModalVisible(true);
  };

  const handleCloseReplayModal = () => {
    setReplayModalVisible(false);
  };

  return (
    <div className="blog">
      <h2 className="blog-title">{title}</h2>
      <div className="blog-author">{author || 'Anonymous'}</div>
      <div 
        className="blog-detail markdown-content"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(detail) }}
      />
      
      {gameData && (
        <button className="blog-replay-btn" onClick={handleOpenReplayModal}>
          Replay Game
        </button>
      )}
      
      {showEditControls && (
        <>
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </>
      )}
      <Comments blogId={id} />

      {replayModalVisible && gameData && (
        <GameReplayModal 
          moveHistory={gameData.moveHistory}
          onClose={handleCloseReplayModal}
        />
      )}
    </div>
  );
};

export default Blog;