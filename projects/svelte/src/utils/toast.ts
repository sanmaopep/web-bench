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
