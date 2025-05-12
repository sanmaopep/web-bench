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

import React, { useState, useEffect } from 'react'
import useRoomStore from '../stores/room'
import useUserStore from '../stores/user'
import { navigate } from '../stores/route'

const Rooms = () => {
  const { rooms, createRoom } = useRoomStore()
  const { username, isLoggedIn } = useUserStore()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [roomName, setRoomName] = useState('')

  const handleCreateRoom = () => {
    if (!roomName.trim() || !isLoggedIn) return

    const newRoom = {
      id: `room_${Date.now()}`,
      name: roomName,
      creator: username || 'Anonymous',
      createdAt: new Date().toISOString(),
    }

    createRoom(newRoom)
    setRoomName('')
    setShowCreateForm(false)
  }

  const handleJoinRoom = (roomId: string) => {
    navigate(`/chat/${roomId}`)
  }

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>Game Rooms</h1>
        <button
          className="create-room-btn"
          onClick={() => setShowCreateForm(true)}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Create Room
        </button>
      </div>

      {showCreateForm && (
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
          }}
        >
          <h2>Create New Room</h2>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="roomName" style={{ display: 'block', marginBottom: '8px' }}>
              Room Name
            </label>
            <input
              id="roomName"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleCreateRoom}
              style={{
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {rooms.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            No rooms available. Create a new room to get started!
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="room-card"
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onClick={() => handleJoinRoom(room.id)}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{room.name}</h3>
              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '10px',
                }}
              >
                <div>
                  Creator: <span style={{ fontWeight: 'bold' }}>{room.creator}</span>
                </div>
                <div>Created: {new Date(room.createdAt).toLocaleString()}</div>
              </div>
              <button
                style={{
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: 'auto',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinRoom(room.id);
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
}

export default Rooms