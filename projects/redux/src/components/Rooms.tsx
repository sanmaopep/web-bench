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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Rooms.css';
import { RootState } from '../store';
import RoomCard from './RoomCard';
import CreateRoomForm from './CreateRoomForm';
import { syncRoomsFromStorage } from '../models/room';

const Rooms: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const rooms = useSelector((state: RootState) => state.room.rooms);
  const user = useSelector((state: RootState) => state.user.username);
  const dispatch = useDispatch();

  const handleCreateRoom = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  // Setup broadcast channel for room updates
  useEffect(() => {
    const channel = new BroadcastChannel('room_updates');
    
    channel.onmessage = (event) => {
      if (event.data.type === 'ROOM_UPDATED') {
        // Update the rooms state with the received rooms
        dispatch(syncRoomsFromStorage(event.data.rooms));
      }
    };
    
    return () => {
      channel.close();
    };
  }, [dispatch]);

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <h1 className="rooms-title">Game Rooms</h1>
        {user && (
          <button className="create-room-btn" onClick={handleCreateRoom}>
            Create Room
          </button>
        )}
      </div>
      
      {rooms.length > 0 ? (
        <div className="rooms-list">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="no-rooms">
          {user ? 'No rooms available. Create the first one!' : 'No rooms available. Please login to create a room.'}
        </div>
      )}
      
      {showCreateForm && (
        <div className="form-overlay">
          <CreateRoomForm onClose={handleCloseForm} />
        </div>
      )}
    </div>
  );
};

export default Rooms;