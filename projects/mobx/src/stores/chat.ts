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

import { makeAutoObservable, action } from 'mobx';

interface Message {
  senderId: string;
  content: string;
  timestamp: number;
}

const safeJsonParse = (json: string, defaultData?: any) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return defaultData;
  }
}

class ChatStore {
  messages: Record<string, Message[]> = {};
  participants: Record<string, string[]> = {};
  lastHeartbeats: Record<string, Record<string, number>> = {};

  constructor() {
    makeAutoObservable(this);
    this.setupStorageListener();
    this.startHeartbeatCheck();
  }

  // Set up listeners for cross-tab communication
  private setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'chatMessages' && event.newValue) {
        try {
          this.messages = JSON.parse(event.newValue);
        } catch (error) {
          console.error('Failed to parse chat messages from storage:', error);
        }
      }
      
      if (event.key === 'chatParticipants' && event.newValue) {
        try {
          this.participants = JSON.parse(event.newValue);
        } catch (error) {
          console.error('Failed to parse chat participants from storage:', error);
        }
      }
      
      if (event.key === 'chatHeartbeats' && event.newValue) {
        try {
          this.lastHeartbeats = JSON.parse(event.newValue);
        } catch (error) {
          console.error('Failed to parse chat heartbeats from storage:', error);
        }
      }
    });
  }

  // Initialize chat data for a room if it doesn't exist
  initializeChat = action((roomId: string) => {
    const messages = localStorage.getItem('chatMessages');
    const participants = localStorage.getItem('chatParticipants');
    const heartbeats = localStorage.getItem('chatHeartbeats');

    if (messages) {
      this.messages = safeJsonParse(messages, {});
    }
    if (participants) {
      this.participants =safeJsonParse(participants, {});
    }
    if (heartbeats) {
      this.lastHeartbeats = safeJsonParse(heartbeats, {});
    }

    if(!this.messages[roomId]) {
      this.messages[roomId] = [];
    }
    if(!this.participants[roomId]) {
      this.participants[roomId] = [];
    }
    if(!this.lastHeartbeats[roomId]) {
      this.lastHeartbeats[roomId] = {};
    }
    // Save to localStorage for cross-tab sync

  });

  // Add a user to a chat room
  joinChat = action((roomId: string, username: string) => {
    this.initializeChat(roomId);
    
    if (!this.participants[roomId].includes(username)) {
      this.participants[roomId].push(username);
      
      // Send a system message that user joined
      this.messages[roomId].push({
        senderId: 'System',
        content: `${username} has joined the chat`,
        timestamp: Date.now()
      });
      
      // Initialize heartbeat
      this.lastHeartbeats[roomId][username] = Date.now();
      
      // Save to localStorage for cross-tab sync
      this.saveToStorage();
    }
  });

  // Remove a user from a chat room
  leaveChat = action((roomId: string, username: string) => {
    if (this.participants[roomId]?.includes(username)) {
      this.participants[roomId] = this.participants[roomId].filter(p => p !== username);
      
      // Send a system message that user left
      this.messages[roomId].push({
        senderId: 'System',
        content: `${username} has left the chat`,
        timestamp: Date.now()
      });
      
      // Remove heartbeat
      if (this.lastHeartbeats[roomId]) {
        delete this.lastHeartbeats[roomId][username];
      }
      
      // Save to localStorage for cross-tab sync
      this.saveToStorage();
    }
  });

  // Record a heartbeat for a user in a room
  sendHeartbeat = action((roomId: string, username: string) => {
    this.initializeChat(roomId);
    
    this.lastHeartbeats[roomId][username] = Date.now();
    
    // Check if user needs to be added to participants
    if (!this.participants[roomId].includes(username)) {
      this.participants[roomId].push(username);
    }
    
    // Save heartbeats to localStorage
    localStorage.setItem('chatHeartbeats', JSON.stringify(this.lastHeartbeats));
  });

  // Periodically check heartbeats and remove inactive users
  startHeartbeatCheck = action(() => {
    setInterval(() => {
      const now = Date.now();
      
      // Check each room's heartbeats
      Object.keys(this.lastHeartbeats).forEach(roomId => {
        Object.keys(this.lastHeartbeats[roomId]).forEach(username => {
          const lastHeartbeat = this.lastHeartbeats[roomId][username];
          
          // If no heartbeat for more than 2 seconds, remove user
          if (now - lastHeartbeat > 2000) {
            this.leaveChat(roomId, username);
          }
        });
      });
    }, 1000);
  });

  // Send a message in a chat room
  sendMessage = action((roomId: string, message: Message) => {
    this.initializeChat(roomId);
    
    this.messages[roomId].push(message);
    
    // Save to localStorage for cross-tab sync
    this.saveToStorage();
  });

  // Save chat data to localStorage for cross-tab sync
  private saveToStorage() {
    localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    localStorage.setItem('chatParticipants', JSON.stringify(this.participants));
    localStorage.setItem('chatHeartbeats', JSON.stringify(this.lastHeartbeats));
  }
}

const chatStore = new ChatStore();
export default chatStore;