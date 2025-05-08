import React from 'react';
import './RoomCard.css';
import { Room } from '../models/room';
import { useDispatch } from 'react-redux';
import { navigate } from '../middleware/route';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { name, creator, status, id } = room;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(navigate(`/chat/${id}`));
  };

  return (
    <div className="room-card" onClick={handleClick}>
      <h3 className="room-name">{name}</h3>
      <p className="room-creator">Created by: {creator}</p>
      <div className={`room-status status-${status.toLowerCase().replace(' ', '-')}`}>
        {status}
      </div>
    </div>
  );
};

export default RoomCard;