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
import { navigateAtom } from './route';

export interface Room {
  id: string;
  name: string;
  creator: string;
  created: number;
  status: 'waiting' | 'playing' | 'finished';
}

export const roomsAtom = atom<Room[]>([]);
export const showRoomFormAtom = atom<boolean>(false);

export const createRoomAtom = atom(
  null,
  (get, set, name: string) => {
    const user = get(userAtom);
    const rooms = get(roomsAtom);
    
    const newRoom: Room = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      creator: user.isLoggedIn ? user.username : 'Anonymous',
      created: Date.now(),
      status: 'waiting'
    };
    
    set(roomsAtom, [...rooms, newRoom]);
    set(showRoomFormAtom, false);
    
    // Broadcast the room creation to other tabs
    localStorage.setItem('latestRoomAction', JSON.stringify({
      type: 'create',
      room: newRoom,
      timestamp: Date.now()
    }));
  }
);

export const toggleRoomFormAtom = atom(
  null,
  (get, set) => {
    const currentValue = get(showRoomFormAtom);
    set(showRoomFormAtom, !currentValue);
  }
);

export const syncRoomsAtom = atom(
  null,
  (get, set) => {
    const storedAction = localStorage.getItem('latestRoomAction');
    if (storedAction) {
      try {
        const action = JSON.parse(storedAction);
        const currentRooms = get(roomsAtom);
        
        if (action.type === 'create') {
          // Check if we already have this room
          const roomExists = currentRooms.some(room => room.id === action.room.id);
          if (!roomExists) {
            set(roomsAtom, [...currentRooms, action.room]);
          }
        } else if (action.type === 'update') {
          const updatedRooms = currentRooms.map(room => 
            room.id === action.roomId ? { ...room, ...action.updates } : room
          );
          set(roomsAtom, updatedRooms);
        }
      } catch (e) {
        console.error('Error syncing rooms:', e);
      }
    }
  }
);

// Add a listener to detect storage changes from other windows
syncRoomsAtom.onMount = (setAtom) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'latestRoomAction') {
      setAtom();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};