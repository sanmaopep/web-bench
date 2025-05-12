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

import { createApp, defineComponent, h, onMounted, onUnmounted, PropType } from 'vue'

const Toast = defineComponent({
  props: {
    message: {
      type: String as PropType<string>,
      required: true,
    },
    duration: {
      type: Number as PropType<number>,
      default: 2000,
    },
    style: {
      type: Object as PropType<Record<string, string | number>>,
      default: () => ({}),
    },
    onClose: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },

  setup(props) {
    onMounted(() => {
      const timer = setTimeout(() => {
        props.onClose()
      }, props.duration)

      onUnmounted(() => {
        clearTimeout(timer)
      })
    })

    return () =>
      h(
        'div',
        {
          style: {
            backgroundColor: 'green',
            color: 'white',
            fontSize: '12px',
            padding: '10px',
            borderRadius: '5px',
            position: 'fixed',
            zIndex: 9999,
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            textWrap: 'nowrap',
            ...props.style,
          },
        },
        props.message
      )
  },
})

let toastContainer: HTMLDivElement | null = null

export const showToast = (
  message: string,
  duration?: number,
  style?: Record<string, string | number>
) => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    document.body.appendChild(toastContainer)
  }

  const toastId = Date.now()
  const app = createApp({
    setup() {
      const handleClose = () => {
        if (toastContainer) {
          app.unmount()
        }
      }

      return () =>
        h(
          'div',
          {
            style: {
              position: 'fixed',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
            },
          },
          [
            h(Toast, {
              key: toastId,
              message,
              duration,
              style,
              onClose: handleClose,
            }),
          ]
        )
    },
  })

  app.mount(toastContainer)
}
