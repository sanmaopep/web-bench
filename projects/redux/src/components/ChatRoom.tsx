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

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ChatRoom.css';
import { RootState } from '../store';
import { navigate } from '../middleware/route';
import { sendMessage, joinChatRoom, leaveChatRoom, syncChatRoom, heartbeat } from '../models/chat';

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState('');
  const messageListRef = useRef<HTMLDivElement>(null);
  const username = useSelector((state: RootState) => state.user.username);
  const room = useSelector((state: RootState) => 
    state.room.rooms.find(r => r.id === roomId)
  );
  const messages = useSelector((state: RootState) => 
    state.chat.messages.filter(m => m.roomId === roomId)
  );
  const participants = useSelector((state: RootState) => 
    state.chat.participants.filter(p => p.roomId === roomId)
  );

  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!room) {
      dispatch(navigate('/rooms'));
      return;
    }

    if (username) {
      dispatch(joinChatRoom({ roomId, username }));
      
      // Set up heartbeat
      heartbeatIntervalRef.current = setInterval(() => {
        dispatch(heartbeat({ roomId, username }));
      }, 1000);
    }

    // Set up broadcast channel for syncing
    const channel = new BroadcastChannel('chat_updates');
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CHAT_UPDATED' && event.data.roomId === roomId) {
        dispatch(syncChatRoom(roomId));
      }
    };
    
    channel.addEventListener('message', handleMessage);
    
    // Cleanup on unmount
    return () => {
      if (username) {
        dispatch(leaveChatRoom({ roomId, username }));
      }
      
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [dispatch, roomId, username, room]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageText.trim() && username) {
      dispatch(sendMessage({
        roomId,
        sender: username,
        content: messageText.trim(),
        timestamp: new Date().toISOString()
      }));
      setMessageText('');
    }
  };

  const handleBack = () => {
    dispatch(navigate('/rooms'));
  };

  if (!room) {
    return null;
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-room">
      <button className="back-button" onClick={handleBack}>
        ← Back to Rooms
      </button>
      
      <div className="chat-header">
        <h1 className="chat-title">{room.name}</h1>
        <div className={`chat-status status-${room.status.toLowerCase().replace(' ', '-')}`}>
          {room.status}
        </div>
      </div>
      
      <div className="chat-body">
        <div className="chat-main">
          <div className="message-list" ref={messageListRef}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={`${message.timestamp}-${index}`} 
                  className={`message ${message.sender === username ? 'own-message' : ''}`}
                >
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-content">{message.content}</div>
                  <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
                </div>
              ))
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="chat-input-container">
            <textarea
              className="message-input"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button type="submit" className="send-button" disabled={!messageText.trim()}>
              Send
            </button>
          </form>
        </div>
        
        <div className="chat-sidebar">
          <div className="participant-header">
            <h2 className="participant-title">Participants ({participants.length})</h2>
          </div>
          <div className="participant-list">
            {participants.map((participant) => (
              <div key={participant.username} className="participant">
                <div className="participant-avatar">
                  {participant.username.charAt(0).toUpperCase()}
                </div>
                <div className="participant-name">{participant.username}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;