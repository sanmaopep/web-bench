let isDragging = false
let isResizerDragging = false
let startX
let leftbarStartWidth

export function initResizer() {
  /** @type {HTMLElement} */
  // @ts-ignore
  const leftbar = document.querySelector('.leftbar')
  const resizer = document.querySelector('.resizer')
  if (!resizer || !leftbar) return

  resizer.addEventListener('mousedown', (e) => {
    isDragging = true
    isResizerDragging = true
    // @ts-ignore
    startX = e.pageX
    leftbarStartWidth = leftbar.offsetWidth
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    const deltaX = e.pageX - startX

    if (isResizerDragging) {
      const newContentWidth = leftbarStartWidth + deltaX
      leftbar.style.width = newContentWidth + 'px'
    }

    e.preventDefault()
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
    isResizerDragging = false
  })
}
