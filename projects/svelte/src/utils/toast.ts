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

import { writable } from 'svelte/store'

interface Toast {
  message: string
  visible: boolean
  fontSize: number
}

function createToastStore() {
  const { subscribe, set, update } = writable<Toast>({
    message: '',
    visible: false,
    fontSize: 12,
  })

  let timeoutId: number

  const showToast = (message: string, fontSize = 12) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    update((toast) => ({
      message,
      fontSize,
      visible: false,
    }))

    setTimeout(() => {
      update((toast) => ({
        ...toast,
        visible: true,
      }))

      timeoutId = setTimeout(() => {
        update((toast) => ({
          message: '',
          fontSize: 12,
          visible: false,
        }))
      }, 2000) as unknown as number
    }, 10)
  }

  return {
    subscribe,
    showToast,
  }
}

export const toast = createToastStore()
