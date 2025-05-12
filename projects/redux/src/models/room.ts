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

export interface Room {
  id: string;
  name: string;
  creator: string;
  status: 'Waiting' | 'In Game' | 'Finished';
  createdAt: number;
}

interface RoomCreatePayload {
  name: string;
  creator: string;
}

export interface RoomState {
  rooms: Room[];
}

// Load initial state from localStorage if available
const getInitialState = (): RoomState => {
  try {
    const savedRooms = localStorage.getItem('game_rooms');
    if (savedRooms) {
      return { rooms: JSON.parse(savedRooms) };
    }
  } catch (error) {
    console.error('Failed to load rooms from localStorage:', error);
  }
  return { rooms: [] };
};

const initialState: RoomState = getInitialState();

const generateRoomId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Create a broadcast channel for syncing room updates across tabs
const broadcastRoomUpdate = (rooms: Room[]) => {
  try {
    // Save to localStorage
    localStorage.setItem('game_rooms', JSON.stringify(rooms));
    
    // Broadcast to other tabs
    const channel = new BroadcastChannel('room_updates');

    channel.postMessage({ type: 'ROOM_UPDATED' });
  } catch (error) {
    console.error('Failed to broadcast room update:', error);
  }
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    createRoom: (state, action: PayloadAction<RoomCreatePayload>) => {
      const newRoom: Room = {
        id: generateRoomId(),
        name: action.payload.name,
        creator: action.payload.creator,
        status: 'Waiting',
        createdAt: Date.now()
      };
      
      state.rooms.push(newRoom);
      
      // Broadcast the update to other tabs
      broadcastRoomUpdate(state.rooms);
    },
    updateRoomStatus: (state, action: PayloadAction<{roomId: string, status: Room['status']}>) => {
      const room = state.rooms.find(r => r.id === action.payload.roomId);
      if (room) {
        room.status = action.payload.status;
        broadcastRoomUpdate(state.rooms);
      }
    },
    deleteRoom: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter(room => room.id !== action.payload);
      broadcastRoomUpdate(state.rooms);
    },
    syncRoomsFromStorage: (state) => {
      state.rooms = getInitialState().rooms
    }
  }
});

export const { createRoom, updateRoomStatus, deleteRoom, syncRoomsFromStorage } = roomSlice.actions;
export default roomSlice.reducer;