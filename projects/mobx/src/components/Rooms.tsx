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

import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import roomStore from '../stores/room'
import userStore from '../stores/user'
import routeStore from '../stores/route'

const Rooms: React.FC = observer(() => {
  const [showForm, setShowForm] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [error, setError] = useState('')

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!roomName.trim()) {
      setError('Room name is required')
      return
    }
    
    if (!userStore.isLoggedIn) {
      setError('You must be logged in to create a room')
      return
    }
    
    roomStore.createRoom(roomName, userStore.username)
    setRoomName('')
    setShowForm(false)
    setError('')
  }

  const handleRoomClick = (roomId: string) => {
    if (!userStore.isLoggedIn) {
      routeStore.navigate('/login');
      return;
    }
    routeStore.navigate(`/chat/${roomId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Game Rooms</h1>
        <button
          className="create-room-btn"
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create Room
        </button>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
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
              onClick={() => {
                setShowForm(false)
                setError('')
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <h2 style={{ marginBottom: '20px' }}>Create New Room</h2>
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <form onSubmit={handleCreateRoom}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="roomName" style={{ display: 'block', marginBottom: '5px' }}>Room Name</label>
                <input 
                  id="roomName"
                  type="text" 
                  value={roomName} 
                  onChange={(e) => {
                    setRoomName(e.target.value)
                    setError('')
                  }}
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: '#4CAF50', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 15px', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px' 
      }}>
        {roomStore.rooms.length === 0 ? (
          <p>No rooms available. Create one!</p>
        ) : (
          roomStore.rooms.map(room => (
            <div 
              key={room.id} 
              className="room-card"
              onClick={() => handleRoomClick(room.id)}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }
              }}
            >
              <h3 style={{ marginTop: 0, color: '#333' }}>{room.name}</h3>
              <p style={{ margin: '10px 0', color: '#666' }}>
                <strong>Created by:</strong> {room.creator}
              </p>
              <p style={{ margin: '10px 0', color: '#666' }}>
                <strong>Status:</strong> {room.status}
              </p>
              <p style={{ margin: '10px 0', color: '#666' }}>
                <strong>Created:</strong> {new Date(room.createdAt).toLocaleString()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleRoomClick(room.id);
                }}
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '10px'
                }}
              >
                Join Room
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
})

export default Rooms