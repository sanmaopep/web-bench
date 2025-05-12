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
import useChatStore from '../stores/chat'
import useUserStore from '../stores/user'
import { navigate } from '../stores/route'
import useRouteStore from '../stores/route'

const ChatRoom = () => {
  const [message, setMessage] = useState('')
  const currentRoute = useRouteStore((state) => state.currentRoute)
  const { username, isLoggedIn } = useUserStore()
  
  // Extract room ID from route
  const roomId = currentRoute.replace('/chat/', '')
  
  const { 
    messages, 
    participants, 
    joinRoom, 
    leaveRoom, 
    sendMessage,
    sendHeartbeat 
  } = useChatStore()
  
  const roomMessages = messages.filter(msg => msg.roomId === roomId)
  const roomParticipants = participants.filter(p => p.roomId === roomId)
  
  const messageEndRef = useRef<HTMLDivElement>(null)
  const heartbeatRef = useRef<number | null>(null)
  
  useEffect(() => {
    if (isLoggedIn && username) {
      joinRoom(roomId, username)
      
      // Setup heartbeat
      heartbeatRef.current = window.setInterval(() => {
        sendHeartbeat(roomId, username)
      }, 1000)
    }
    
    return () => {
      if (isLoggedIn && username) {
        leaveRoom(roomId, username)
      }
      
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }
    }
  }, [roomId, username, isLoggedIn, joinRoom, leaveRoom, sendHeartbeat])
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [roomMessages])
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (message.trim() && isLoggedIn && username) {
      sendMessage(roomId, {
        sender: username,
        content: message.trim(),
        timestamp: new Date().toISOString()
      })
      setMessage('')
    }
  }
  
  const handleBackToRooms = () => {
    navigate('/rooms')
  }
  
  if (!isLoggedIn) {
    return (
      <div style={{ 
        padding: '20px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '40px auto'
      }}>
        <h2>Please login to join the chat room</h2>
        <button
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 100px)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleBackToRooms}
          style={{
            backgroundColor: '#f0f0f0',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Rooms
        </button>
        <div className="room-status">
          <span style={{ 
            fontWeight: 'bold',
            color: '#2196f3'
          }}>
            Room: {roomId}
          </span>
          <span style={{ marginLeft: '10px' }}>
            {roomParticipants.length} active users
          </span>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        flex: 1,
        gap: '20px',
        height: 'calc(100% - 60px)'
      }}>
        {/* Chat area */}
        <div style={{
          flex: 3,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Messages list */}
          <div className="message-list" style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9'
          }}>
            {roomMessages.length === 0 ? (
              <div style={{ 
                textAlign: 'center',
                color: '#666',
                marginTop: '20px'
              }}>
                No messages yet. Start the conversation!
              </div>
            ) : (
              roomMessages.map((msg, index) => (
                <div 
                  key={index}
                  className="message"
                  style={{
                    marginBottom: '15px',
                    padding: '12px',
                    borderRadius: '8px',
                    maxWidth: '80%',
                    alignSelf: msg.sender === username ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === username ? '#e3f2fd' : '#f5f5f5',
                    marginLeft: msg.sender === username ? 'auto' : '0'
                  }}
                >
                  <div className="message-sender" style={{
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: msg.sender === username ? '#1976d2' : '#333'
                  }}>
                    {msg.sender}
                  </div>
                  <div style={{ wordBreak: 'break-word' }}>
                    {msg.content}
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: '#999',
                    textAlign: 'right',
                    marginTop: '4px'
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            <div ref={messageEndRef}></div>
          </div>
          
          {/* Message input */}
          <form 
            onSubmit={handleSendMessage}
            style={{
              display: 'flex',
              padding: '10px',
              borderTop: '1px solid #eee'
            }}
          >
            <input
              className="message-input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginRight: '10px'
              }}
            />
            <button
              className="send-button"
              type="submit"
              disabled={!message.trim()}
              style={{
                backgroundColor: !message.trim() ? '#cccccc' : '#2196f3',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: !message.trim() ? 'default' : 'pointer'
              }}
            >
              Send
            </button>
          </form>
        </div>
        
        {/* Participants list */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>Participants</h3>
          <div className="participant-list">
            {roomParticipants.length === 0 ? (
              <div style={{ color: '#666' }}>No active users</div>
            ) : (
              roomParticipants.map((participant, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: participant.username === username ? '#e3f2fd' : '#f5f5f5',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#4caf50',
                    marginRight: '10px'
                  }}></div>
                  <span style={{
                    fontWeight: participant.username === username ? 'bold' : 'normal'
                  }}>
                    {participant.username} {participant.username === username ? '(You)' : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom