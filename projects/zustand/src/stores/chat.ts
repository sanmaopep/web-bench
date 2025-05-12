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

interface Message {
  roomId: string
  sender: string
  content: string
  timestamp: string
}

interface Participant {
  roomId: string
  username: string
  lastActive: string
}

interface ChatStore {
  messages: Message[]
  participants: Participant[]
  joinRoom: (roomId: string, username: string) => void
  leaveRoom: (roomId: string, username: string) => void
  sendMessage: (roomId: string, message: Omit<Message, 'roomId'>) => void
  sendHeartbeat: (roomId: string, username: string) => void
  checkParticipants: () => void
}

// Create a shared channel for cross-tab communication
const channel = new BroadcastChannel('chat_sync_channel')

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      participants: [],

      joinRoom: (roomId, username) => {
        set((state) => {
          // Check if user is already in the room
          const existingParticipant = state.participants.find(
            p => p.roomId === roomId && p.username === username
          )
          
          if (existingParticipant) {
            // Update last active timestamp
            return {
              participants: state.participants.map(p => 
                p.roomId === roomId && p.username === username
                  ? { ...p, lastActive: new Date().toISOString() }
                  : p
              )
            }
          } else {
            // Add new participant
            const newParticipant = {
              roomId,
              username,
              lastActive: new Date().toISOString()
            }
            
            // Broadcast the join event
            channel.postMessage({
              type: 'JOIN_ROOM',
              payload: newParticipant
            })
            
            return {
              participants: [...state.participants, newParticipant]
            }
          }
        })
      },

      leaveRoom: (roomId, username) => {
        set((state) => {
          // Remove participant
          const newParticipants = state.participants.filter(
            p => !(p.roomId === roomId && p.username === username)
          )
          
          // Broadcast the leave event
          channel.postMessage({
            type: 'LEAVE_ROOM',
            payload: { roomId, username }
          })
          
          return {
            participants: newParticipants
          }
        })
      },

      sendMessage: (roomId, messageData) => {
        const message = {
          roomId,
          ...messageData
        }
        
        set((state) => {
          // Add message
          const newMessages = [...state.messages, message]
          
          // Broadcast the message
          channel.postMessage({
            type: 'NEW_MESSAGE',
            payload: message
          })
          
          return {
            messages: newMessages
          }
        })
      },

      sendHeartbeat: (roomId, username) => {
        set((state) => {
          // Update last active timestamp
          const participants = state.participants.map(p => 
            p.roomId === roomId && p.username === username
              ? { ...p, lastActive: new Date().toISOString() }
              : p
          )
          
          // Broadcast the heartbeat
          channel.postMessage({
            type: 'HEARTBEAT',
            payload: { roomId, username, timestamp: new Date().toISOString() }
          })
          
          return { participants }
        })
        
        // Check for inactive participants
        get().checkParticipants()
      },

      checkParticipants: () => {
        set((state) => {
          const now = new Date().getTime()
          const newParticipants = state.participants.filter(p => {
            const lastActive = new Date(p.lastActive).getTime()
            return now - lastActive < 2000 // Remove if inactive for 2 seconds
          })
          
          // Only update if participants changed
          if (newParticipants.length !== state.participants.length) {
            return { participants: newParticipants }
          }
          
          return state
        })
      }
    }),
    {
      name: 'chat-storage',
    }
  )
)

// Handle broadcast channel messages
channel.onmessage = (event) => {
  const { type, payload } = event.data
  const store = useChatStore.getState()
  
  switch (type) {
    case 'JOIN_ROOM':
      // Add participant if not already present
      useChatStore.setState(state => {
        const exists = state.participants.some(
          p => p.roomId === payload.roomId && p.username === payload.username
        )
        
        if (!exists) {
          return {
            participants: [...state.participants, payload]
          }
        }
        return state
      })
      break
      
    case 'LEAVE_ROOM':
      // Remove participant
      useChatStore.setState(state => ({
        participants: state.participants.filter(
          p => !(p.roomId === payload.roomId && p.username === payload.username)
        )
      }))
      break
      
    case 'NEW_MESSAGE':
      // Add message if not already present
      useChatStore.setState(state => {
        const messageExists = state.messages.some(
          m => m.roomId === payload.roomId && 
              m.sender === payload.sender && 
              m.timestamp === payload.timestamp
        )
        
        if (!messageExists) {
          return {
            messages: [...state.messages, payload]
          }
        }
        return state
      })
      break
      
    case 'HEARTBEAT':
      // Update participant's last active timestamp
      useChatStore.setState(state => ({
        participants: state.participants.map(p => 
          p.roomId === payload.roomId && p.username === payload.username
            ? { ...p, lastActive: payload.timestamp }
            : p
        )
      }))
      
      // Check for inactive participants
      store.checkParticipants()
      break
      
    default:
      break
  }
}

// Set up interval to check for inactive participants
setInterval(() => {
  useChatStore.getState().checkParticipants()
}, 1000)

export default useChatStore