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

interface Room {
  id: string;
  name: string;
  creator: string;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
  players: string[];
}

class RoomStore {
  rooms: Room[] = [];
  
  constructor() {
    makeAutoObservable(this);
    this.loadRoomsFromStorage();
    this.setupStorageListener();
  }
  
  private loadRoomsFromStorage() {
    try {
      const savedRooms = localStorage.getItem('gameRooms');
      if (savedRooms) {
        this.rooms = JSON.parse(savedRooms);
      }
    } catch (error) {
      console.error('Failed to load rooms from storage:', error);
    }
  }
  
  private saveRoomsToStorage() {
    try {
      localStorage.setItem('gameRooms', JSON.stringify(this.rooms));
      // Dispatch a custom event to notify other tabs
      const event = new CustomEvent('roomsUpdated', { detail: { rooms: this.rooms } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to save rooms to storage:', error);
    }
  }
  
  private setupStorageListener() {
    // Listen for custom events from other tabs
    window.addEventListener('roomsUpdated', ((event: CustomEvent) => {
      // Update local state with the received rooms
      if (event.detail && event.detail.rooms) {
        this.rooms = event.detail.rooms;
      }
    }) as EventListener);
    
    // Alternative approach using storage event
    window.addEventListener('storage', (event) => {
      if (event.key === 'gameRooms' && event.newValue) {
        try {
          this.rooms = JSON.parse(event.newValue);
        } catch (error) {
          console.error('Failed to parse rooms from storage event:', error);
        }
      }
    });
  }
  
  createRoom = action((name: string, creator: string) => {
    const newRoom: Room = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name,
      creator,
      status: 'waiting',
      createdAt: Date.now(),
      players: [creator]
    };
    
    this.rooms.push(newRoom);
    this.saveRoomsToStorage();
    return newRoom.id;
  });
  
  joinRoom = action((roomId: string, username: string) => {
    const roomIndex = this.rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return false;
    
    const room = this.rooms[roomIndex];
    
    // Check if user is already in the room
    if (!room.players.includes(username)) {
      room.players.push(username);
      
      // If two players, change status to playing
      if (room.players.length === 2) {
        room.status = 'playing';
      }
      
      this.saveRoomsToStorage();
    }
    
    return true;
  });
  
  updateRoomStatus = action((roomId: string, status: 'waiting' | 'playing' | 'finished') => {
    const roomIndex = this.rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return false;
    
    this.rooms[roomIndex].status = status;
    this.saveRoomsToStorage();
    return true;
  });
  
  deleteRoom = action((roomId: string) => {
    const roomIndex = this.rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex === -1) return false;
    
    this.rooms.splice(roomIndex, 1);
    this.saveRoomsToStorage();
    return true;
  });
}

const roomStore = new RoomStore();
export default roomStore;