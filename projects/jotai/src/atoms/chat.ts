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

import { atom } from 'jotai';
import { userAtom } from './user';

export interface Message {
  id: string;
  roomId: string;
  text: string;
  sender: string;
  timestamp: number;
}

export interface Participant {
  username: string;
  lastActive: number;
}

export interface RoomState {
  messages: Message[];
  participants: Participant[];
}

// Map of roomId -> room state
export const roomStatesAtom = atom<Record<string, RoomState>>({});

// Current active room id
export const activeRoomIdAtom = atom<string | null>(null);

// Active room state derived from roomStates and activeRoomId
export const activeRoomStateAtom = atom(
  (get) => {
    const roomId = get(activeRoomIdAtom);
    if (!roomId) return null;
    
    const roomStates = get(roomStatesAtom);
    return roomStates[roomId] || { messages: [], participants: [] };
  }
);

export const getRoomStorageKey = (roomId: string) => `room_state_${roomId}`;

export const getLatestRoomState = (roomId: string):RoomState => {
  const roomStateData = localStorage.getItem(getRoomStorageKey(roomId))

  let data = { messages: [], participants: [] }

  try {
    if(roomStateData) {
      data = JSON.parse(roomStateData);
    }
  } catch (e) {
    console.error('Error parsing room state:', e);
  } finally{
    return data;

  }
}

export const saveRoomState = (roomId:string, state: RoomState) => {
  localStorage.setItem(getRoomStorageKey(roomId), JSON.stringify(state));
}

export const setRoomStateAtom = atom(null, (get, set, nextRoomState: RoomState) => {
  const roomId = get(activeRoomIdAtom);
  if(!roomId) return;
  const roomStates = get(roomStatesAtom);

  if(!nextRoomState) return;
  set(roomStatesAtom, {
  ...roomStates,
    [roomId]: nextRoomState
  });
})

// Helper to extract route parameter
const extractRoomId = (pathname: string): string | null => {
  const match = pathname.match(/^\/chat\/([^\/]+)$/);
  return match ? match[1] : null;
};

// Initialize room if needed
export const initRoomAtom = atom(
  null,
  (get, set, roomId: string) => {
    set(activeRoomIdAtom, roomId);
    const roomState = getLatestRoomState(roomId)
    saveRoomState(roomId, roomState);
    set(setRoomStateAtom, roomState);
  }
);

// Update user active status
export const updateUserActivityAtom = atom(
  null,
  (get, set) => {
    const roomId = get(activeRoomIdAtom);
    const user = get(userAtom);
    if (!roomId || !user.isLoggedIn) return;

    const roomState = getLatestRoomState(roomId)
    
    if (!roomState) return;
    
    const now = Date.now();
    const participants = [...roomState.participants];
    
    const participantIndex = participants.findIndex(p => p.username === user.username);
    
    if (participantIndex >= 0) {
      participants[participantIndex] = {
        ...participants[participantIndex],
        lastActive: now
      };
    } else {
      participants.push({
        username: user.username,
        lastActive: now
      });
    }

    const nextRoomState =  {
      ...roomState,
      participants
    };
    
    saveRoomState(roomId, nextRoomState)
  }
);

// Clean inactive users
export const cleanInactiveUsersAtom = atom(
  null,
  (get, set) => {
    const roomId = get(activeRoomIdAtom);
    if (!roomId) return;
    
    const roomState = getLatestRoomState(roomId);
    if (!roomState) return;
    
    const now = Date.now();
    const participants = roomState.participants.filter(
      p => now - p.lastActive < 2000
    );
    
    if (participants.length !== roomState.participants.length) {
      const nextRoomState = {
        ...roomState,
        participants
      }

      saveRoomState(roomId, nextRoomState)
    }
  }
);

// Send message
export const sendMessageAtom = atom(
  null,
  (get, set, text: string) => {
    const roomId = get(activeRoomIdAtom);
    const user = get(userAtom);
    
    if (!roomId || !text.trim()) return;
    
    const roomState = getLatestRoomState(roomId);
    
    const newMessage: Message = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      roomId,
      text: text.trim(),
      sender: user.isLoggedIn ? user.username : 'Anonymous',
      timestamp: Date.now()
    };

    const nextRoomState = {
     ...roomState,
      messages: [...roomState.messages, newMessage]
    }
    
    saveRoomState(roomId, nextRoomState);
  }
);

// Sync messages and participants from other tabs
export const syncChatStateAtom = atom(
  null,
  (get, set) => {
    const roomId = get(activeRoomIdAtom);

    if(!roomId) {
      return
    }

    set(setRoomStateAtom, getLatestRoomState(roomId));
  }
);

// Handle route change to extract room ID
export const handleChatRouteChangeAtom = atom(
  null,
  (get, set, pathname: string) => {
    const roomId = extractRoomId(pathname);
    if (roomId) {
      set(initRoomAtom, roomId);
    } else {
      set(activeRoomIdAtom, null);
    }
  }
);
