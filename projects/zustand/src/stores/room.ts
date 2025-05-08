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