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

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import chatStore from '../stores/chat';
import userStore from '../stores/user';
import routeStore from '../stores/route';
import roomStore from '../stores/room';

const Chat: React.FC = observer(() => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [heartbeatInterval, setHeartbeatInterval] = useState<NodeJS.Timeout | null>(null);

  // Extract roomId from URL
  const roomId = routeStore.currentRoute.split('/').pop() || '';
  
  // Get room information
  const room = roomStore.rooms.find(r => r.id === roomId);
  
  useEffect(() => {
    if (!room) {
      routeStore.navigate('/rooms');
      return;
    }

    // Initialize chat for the room
    chatStore.initializeChat(roomId);
    
    // Join the chat
    if (userStore.isLoggedIn) {
      chatStore.joinChat(roomId, userStore.username);
    } else {
      routeStore.navigate('/login');
      return;
    }

    // Set up heartbeat
    const interval = setInterval(() => {
      if (userStore.isLoggedIn) {
        chatStore.sendHeartbeat(roomId, userStore.username);
      }
    }, 1000);

    setHeartbeatInterval(interval);

    // Cleanup
    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      chatStore.leaveChat(roomId, userStore.username);
    };
  }, [roomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatStore.messages[roomId]]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !userStore.isLoggedIn) return;
    
    chatStore.sendMessage(roomId, {
      senderId: userStore.username,
      content: message,
      timestamp: Date.now()
    });
    
    setMessage('');
    
    // Focus the input after sending
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  const handleGoBack = () => {
    routeStore.navigate('/rooms');
  };

  if (!room) {
    return <div>Room not found. Redirecting...</div>;
  }

  return (
    <div className="chat-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <button 
          onClick={handleGoBack}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Rooms
        </button>
        <h1 style={{ margin: 0 }}>{room.name}</h1>
        <div className="room-status" style={{ 
          backgroundColor: room.status === 'playing' ? '#4CAF50' : '#FFA500',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        height: 'calc(100vh - 150px)', 
        gap: '20px'
      }}>
        <div style={{ 
          flex: 1,
          border: '1px solid #ccc',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="message-list" style={{ 
            flex: 1, 
            overflowY: 'auto',
            padding: '15px',
            backgroundColor: '#f9f9f9'
          }}>
            {chatStore.messages[roomId]?.map((msg, index) => (
              <div 
                key={index} 
                className="message"
                style={{ 
                  marginBottom: '15px',
                  backgroundColor: msg.senderId === userStore.username ? '#DCF8C6' : 'white',
                  padding: '10px',
                  borderRadius: '8px',
                  maxWidth: '80%',
                  alignSelf: msg.senderId === userStore.username ? 'flex-end' : 'flex-start',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  marginLeft: msg.senderId === userStore.username ? 'auto' : '0'
                }}
              >
                <div className="message-sender" style={{ 
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#2196F3'
                }}>
                  {msg.senderId}
                </div>
                <div>{msg.content}</div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  textAlign: 'right',
                  marginTop: '5px'
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form 
            onSubmit={handleSendMessage}
            style={{ 
              display: 'flex', 
              padding: '10px',
              borderTop: '1px solid #ccc'
            }}
          >
            <input
              ref={chatInputRef}
              type="text"
              className="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{ 
                flex: 1,
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginRight: '10px'
              }}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!message.trim()}
              style={{ 
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '0 20px',
                borderRadius: '4px',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                opacity: message.trim() ? 1 : 0.7
              }}
            >
              Send
            </button>
          </form>
        </div>

        <div style={{ 
          width: '250px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '15px'
        }}>
          <h3 style={{ marginTop: 0 }}>Participants</h3>
          <div className="participant-list">
            {chatStore.participants[roomId]?.map((participant, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '8px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ 
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  marginRight: '10px'
                }}></div>
                {participant} {participant === userStore.username && '(You)'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Chat;