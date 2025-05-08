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