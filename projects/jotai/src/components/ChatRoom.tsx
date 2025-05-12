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

import React, { useState, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import {
  activeRoomIdAtom,
  activeRoomStateAtom,
  sendMessageAtom,
  updateUserActivityAtom,
  cleanInactiveUsersAtom,
  syncChatStateAtom,
  getRoomStorageKey,
} from '../atoms/chat'
import { navigateAtom } from '../atoms/route'
import { userAtom } from '../atoms/user'

const ChatRoom: React.FC = () => {
  const [activeRoomId] = useAtom(activeRoomIdAtom)
  const [roomState] = useAtom(activeRoomStateAtom)
  const [, sendMessage] = useAtom(sendMessageAtom)
  const [, updateUserActivity] = useAtom(updateUserActivityAtom)
  const [, cleanInactiveUsers] = useAtom(cleanInactiveUsersAtom)
  const [, syncChatState] = useAtom(syncChatStateAtom)
  const [, navigate] = useAtom(navigateAtom)
  const [user] = useAtom(userAtom)

  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [roomState?.messages])

  // Send heartbeat to update user activity
  useEffect(() => {
    if (!activeRoomId) return

    // Initial update
    updateUserActivity()

    // Set up interval for heartbeat
    const heartbeatInterval = setInterval(() => {
      updateUserActivity()
      cleanInactiveUsers()
      syncChatState()
    }, 1000)

    return () => clearInterval(heartbeatInterval)
  }, [activeRoomId, updateUserActivity, cleanInactiveUsers, syncChatState])

  // Handle storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (activeRoomId && e.key === getRoomStorageKey(activeRoomId)) {
        syncChatState()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [syncChatState])

  if (!activeRoomId || !roomState) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Room not found</h2>
        <button
          onClick={() => navigate('/rooms')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Back to Rooms
        </button>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput)
      setMessageInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 200px)',
        padding: '20px',
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
        <h1>Room: {activeRoomId}</h1>
        <button
          onClick={() => navigate('/rooms')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1a365d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Rooms
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          height: 'calc(100% - 60px)',
        }}
      >
        <div
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #eee',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            className="room-status"
            style={{
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderBottom: '1px solid #eee',
              fontWeight: 'bold',
            }}
          >
            <span>{roomState.participants.length} users online</span>
          </div>

          <div
            className="message-list"
            style={{
              flex: '1',
              overflowY: 'auto',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {roomState.messages.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: '#888',
                  marginTop: '20px',
                }}
              >
                No messages yet. Start the conversation!
              </div>
            ) : (
              roomState.messages.map((message) => (
                <div
                  key={message.id}
                  className="message"
                  style={{
                    padding: '10px',
                    backgroundColor: message.sender === user.username ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: '8px',
                    alignSelf: message.sender === user.username ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  <div
                    className="message-sender"
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#1976d2',
                    }}
                  >
                    {message.sender}
                  </div>
                  <div>{message.text}</div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#888',
                      marginTop: '5px',
                      textAlign: 'right',
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              display: 'flex',
              padding: '10px',
              borderTop: '1px solid #eee',
              backgroundColor: '#f9f9f9',
            }}
          >
            <textarea
              className="message-input"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              style={{
                flex: '1',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                resize: 'none',
                marginRight: '10px',
                height: '60px',
              }}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              style={{
                padding: '0 20px',
                backgroundColor: messageInput.trim() ? '#2196f3' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Send
            </button>
          </div>
        </div>

        <div
          style={{
            width: '250px',
            padding: '15px',
            border: '1px solid #eee',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Participants</h3>
          <ul
            className="participant-list"
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {roomState.participants.length === 0 ? (
              <li style={{ color: '#888', fontStyle: 'italic' }}>No participants</li>
            ) : (
              roomState.participants.map((participant) => (
                <li
                  key={participant.username}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    marginBottom: '5px',
                    backgroundColor:
                      participant.username === user.username ? '#e3f2fd' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#4caf50',
                    }}
                  />
                  <span>
                    {participant.username}
                    {participant.username === user.username ? ' (you)' : ''}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom
