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