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