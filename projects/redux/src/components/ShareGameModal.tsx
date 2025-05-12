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
import './ShareGameModal.css';

interface ShareGameModalProps {
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
}

const ShareGameModal: React.FC<ShareGameModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), description.trim());
    }
  };

  return (
    <div className="share-modal">
      <div className="share-modal-content">
        <div className="share-modal-header">
          <h2 className="share-modal-title">Share Game to Blog</h2>
          <button className="share-close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="share-form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              className="title-input"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="share-form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              className="description-input" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe your game (optional)"
            />
          </div>
          <button type="submit" className="share-submit">Share to Blog</button>
        </form>
      </div>
    </div>
  );
};

export default ShareGameModal;