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

import { atom } from 'jotai'
import { handleChatRouteChangeAtom } from './chat'

export const routeAtom = atom<string>(window.location.pathname)

routeAtom.onMount = (setAtom) => {
  const handlePopState = () => {
    setAtom(window.location.pathname)
  }
  window.addEventListener('popstate', handlePopState)
  return () => window.removeEventListener('popstate', handlePopState)
}

export const navigateAtom = atom(null, (get, set, path: string) => {
  window.history.pushState(null, '', path)
  set(routeAtom, path)
  
  // Notify chat system about route change
  set(handleChatRouteChangeAtom, path)
})

// Handle initial route
export const initRouteAtom = atom(null, (get, set) => {
  set(handleChatRouteChangeAtom, window.location.pathname)
})