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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  roomId: string;
  sender: string;
  content: string;
  timestamp: string;
}

export interface Participant {
  roomId: string;
  username: string;
  lastActive: number;
}

export interface ChatState {
  messages: Message[];
  participants: Participant[];
}

const getLatestParticipants = (): Participant[] => {
  const savedParticipants = localStorage.getItem('chat_participants');

  return savedParticipants ? JSON.parse(savedParticipants) : [];
}

// Load initial state from localStorage if available
const getInitialState = (): ChatState => {
  try {
    const savedMessages = localStorage.getItem('chat_messages');
    const savedParticipants = localStorage.getItem('chat_participants');
    
    return {
      messages: savedMessages ? JSON.parse(savedMessages) : [],
      participants: savedParticipants ? JSON.parse(savedParticipants) : []
    };
  } catch (error) {
    console.error('Failed to load chat data from localStorage:', error);
    return { messages: [], participants: [] };
  }
};

const initialState: ChatState = getInitialState();

// Create a broadcast channel for syncing chat updates across tabs
const broadcastChatUpdate = (roomId: string) => {
  try {
    const channel = new BroadcastChannel('chat_updates');
    channel.postMessage({ type: 'CHAT_UPDATED', roomId });
  } catch (error) {
    console.error('Failed to broadcast chat update:', error);
  }
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      
      // Save to localStorage
      localStorage.setItem('chat_messages', JSON.stringify(state.messages));
      
      // Broadcast update
      broadcastChatUpdate(action.payload.roomId);
    },
    
    joinChatRoom: (state, action: PayloadAction<{roomId: string, username: string}>) => {
      const { roomId, username } = action.payload;
      
      // Check if user is already in participants
      const existingParticipant = state.participants.find(
        p => p.roomId === roomId && p.username === username
      );
      
      if (!existingParticipant) {
        state.participants.push({
          roomId,
          username,
          lastActive: Date.now()
        });
        
        // Save to localStorage
        localStorage.setItem('chat_participants', JSON.stringify(state.participants));
        
        // Broadcast update
        broadcastChatUpdate(roomId);
      }
    },
    
    leaveChatRoom: (state, action: PayloadAction<{roomId: string, username: string}>) => {
      const { roomId, username } = action.payload;
      
      state.participants = state.participants.filter(
        p => !(p.roomId === roomId && p.username === username)
      );
      
      // Save to localStorage
      localStorage.setItem('chat_participants', JSON.stringify(state.participants));
      
      // Broadcast update
      broadcastChatUpdate(roomId);
    },
    
    heartbeat: (state, action: PayloadAction<{roomId: string, username: string}>) => {
      const { roomId, username } = action.payload;


      const lastParticipant = getLatestParticipants();
      const participant = lastParticipant.find(
        p => p.roomId === roomId && p.username === username
      );
      
      if (participant) {
        const nextParticipants = lastParticipant.map(_participant => {
          if (_participant.roomId === roomId && _participant.username === username) {
            _participant.lastActive = Date.now();
          }
          return _participant;
        });

        state.participants = nextParticipants
        // Save to localStorage
        localStorage.setItem('chat_participants', JSON.stringify(nextParticipants));
      } else {
        // If participant doesn't exist anymore, add them back
        state.participants = [
          ...lastParticipant,
          {
            roomId,
            username,
            lastActive: Date.now()
          }
        ];
        
        // Save to localStorage
        localStorage.setItem('chat_participants', JSON.stringify(state.participants));
      }
    },
    
    cleanInactiveParticipants: (state) => {
      const now = Date.now();
      const timeoutThreshold = 2000; // 2 seconds

      const lastParticipant = getLatestParticipants();

      const activeParticipants = lastParticipant.filter(
        p => now - p.lastActive < timeoutThreshold
      );
      
      if (activeParticipants.length !== state.participants.length) {
        state.participants = activeParticipants;
        
        // Save to localStorage
        localStorage.setItem('chat_participants', JSON.stringify(state.participants));
        
        // No need to broadcast here as this will happen on all tabs independently
      } else {
        state.participants = lastParticipant
      }
    },
    
    syncChatRoom: (state, action: PayloadAction<string>) => {
      // This just forces a re-read from localStorage
      const savedState = getInitialState();
      
      const roomId = action.payload;
      
      // Only sync messages for this room
      const existingMessagesForOtherRooms = state.messages.filter(m => m.roomId !== roomId);
      const newMessagesForThisRoom = savedState.messages.filter(m => m.roomId === roomId);
      
      state.messages = [...existingMessagesForOtherRooms, ...newMessagesForThisRoom];
      
      // Only sync participants for this room
      const existingParticipantsForOtherRooms = state.participants.filter(p => p.roomId !== roomId);
      const newParticipantsForThisRoom = savedState.participants.filter(p => p.roomId === roomId);
      
      state.participants = [...existingParticipantsForOtherRooms, ...newParticipantsForThisRoom];
    }
  }
});

export const { 
  sendMessage, 
  joinChatRoom, 
  leaveChatRoom, 
  heartbeat, 
  cleanInactiveParticipants, 
  syncChatRoom 
} = chatSlice.actions;
export default chatSlice.reducer;