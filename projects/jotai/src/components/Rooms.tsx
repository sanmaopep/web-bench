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

import React, { useEffect } from 'react'
import { useAtom } from 'jotai'
import { roomsAtom, toggleRoomFormAtom, showRoomFormAtom, syncRoomsAtom } from '../atoms/room'
import RoomForm from './RoomForm'
import { navigateAtom } from '../atoms/route'

const Rooms: React.FC = () => {
  const [rooms] = useAtom(roomsAtom)
  const [showForm] = useAtom(showRoomFormAtom)
  const [, toggleForm] = useAtom(toggleRoomFormAtom)
  const [, syncRooms] = useAtom(syncRoomsAtom)
  const [, navigate] = useAtom(navigateAtom)

  const navigateToChatRoom = (roomId: string) => {
    navigate(`/chat/${roomId}`)
  }

  // Periodically check for room updates from other tabs/windows
  useEffect(() => {
    const intervalId = setInterval(() => {
      syncRooms()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [syncRooms])

  return (
    <div style={{ padding: '20px' }}>
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
          onClick={() => toggleForm()}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Create Room
        </button>
      </div>

      {showForm && <RoomForm />}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              key={room.id}
              className="room-card"
              onClick={() => navigateToChatRoom(room.id)}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: '10px' }}>{room.name}</h3>
              <div style={{ marginBottom: '10px', color: '#666' }}>Created by: {room.creator}</div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor:
                      room.status === 'waiting'
                        ? '#e3f2fd'
                        : room.status === 'playing'
                        ? '#e8f5e9'
                        : '#fff3e0',
                    color:
                      room.status === 'waiting'
                        ? '#1976d2'
                        : room.status === 'playing'
                        ? '#388e3c'
                        : '#f57c00',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {new Date(room.created).toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#e8f5e9',
                  color: '#388e3c',
                  borderRadius: '4px',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                Click to join chat
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
            No rooms available. Create a new room to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default Rooms
