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
