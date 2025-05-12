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
import { useDispatch, useSelector } from 'react-redux';
import './CreateRoomForm.css';
import { createRoom } from '../models/room';
import { RootState } from '../store';

interface CreateRoomFormProps {
  onClose: () => void;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ onClose }) => {
  const [roomName, setRoomName] = useState('');
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.user.username);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (roomName.trim() && username) {
      dispatch(createRoom({
        name: roomName.trim(),
        creator: username,
      }));
      onClose();
    }
  };

  return (
    <form className="create-room-form" onSubmit={handleSubmit}>
      <h2>Create New Room</h2>
      <div className="form-group">
        <label htmlFor="roomName">Room Name</label>
        <input
          id="roomName"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="create-button">
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateRoomForm;