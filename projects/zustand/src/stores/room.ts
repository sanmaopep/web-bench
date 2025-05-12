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

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Room {
  id: string
  name: string
  creator: string
  createdAt: string
}

interface RoomStore {
  rooms: Room[]
  createRoom: (room: Room) => void
}

const channel = new BroadcastChannel('room_sync_channel')

const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      rooms: [],

      createRoom: (room) =>
        set((state) => {
          const nextRooms = [...state.rooms, room]
          channel.postMessage({ type: 'ROOM_UPDATE', rooms: nextRooms })

          return {
            rooms: nextRooms,
          }
        }),
    }),
    {
      name: 'room-storage',
    }
  )
)

channel.onmessage = (event) => {
  if (event.data.type === 'ROOM_UPDATE') {
    // Update room store with the latest data
    useRoomStore.setState({ rooms: event.data.rooms })
  }
}

export default useRoomStore