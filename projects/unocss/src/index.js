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

import 'virtual:uno.css'

function main() {
  let isDragging = false
  let isRightDragging = false
  let isLeftDragging = false
  let startX
  let startY
  let contentStartWidth
  let contentStartHeight
  let leftbarStartWidth
  let rightbarStartWidth
  let rightbarStartHeight

  function initDragHandlers() {
    /** @type {HTMLElement} */
    // @ts-ignore
    const content = document.querySelector('.content')
    /** @type {HTMLElement} */
    // @ts-ignore
    const leftbar = document.querySelector('.leftbar')
    /** @type {HTMLElement} */
    // @ts-ignore
    const rightbar = document.querySelector('.rightbar')
    /** @type {HTMLElement} */
    // @ts-ignore
    const leftDrag = document.querySelector('.left-drag')
    /** @type {HTMLElement} */
    // @ts-ignore
    const rightDrag = document.querySelector('.right-drag')

    rightDrag.addEventListener('mousedown', (e) => {
      console.log(e.type)
      isDragging = true
      isRightDragging = true
      startX = e.pageX
      startY = e.pageY
      contentStartWidth = content.offsetWidth
      contentStartHeight = content.offsetHeight
      rightbarStartWidth = rightbar.offsetWidth
      rightbarStartHeight = rightbar.offsetHeight
    })

    leftDrag.addEventListener('mousedown', (e) => {
      console.log(e.type)
      isDragging = true
      isLeftDragging = true
      startX = e.pageX
      contentStartWidth = content.offsetWidth
      leftbarStartWidth = leftbar.offsetWidth
    })

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      console.log(e.type)

      if (window.innerWidth <= 400 && isRightDragging) {
        // Vertical dragging
        const deltaY = e.pageY - startY
        const newContentHeight = contentStartHeight + deltaY
        const newRightbarHeight = rightbarStartHeight - deltaY

        content.style.height = newContentHeight + 'px'
        rightbar.style.height = newRightbarHeight + 'px'
      } else {
        // Normal horizontal
        const deltaX = e.pageX - startX

        if (isRightDragging) {
          const newContentWidth = contentStartWidth + deltaX
          const newRightbarWidth = rightbarStartWidth - deltaX
          content.style.width = newContentWidth + 'px'
          rightbar.style.width = newRightbarWidth + 'px'
        }

        if (isLeftDragging) {
          const newContentWidth = contentStartWidth - deltaX
          const newLeftbarWidth = leftbarStartWidth + deltaX
          content.style.width = newContentWidth + 'px'
          leftbar.style.width = newLeftbarWidth + 'px'
        }
      }

      e.preventDefault()
    })

    document.addEventListener('mouseup', (e) => {
      console.log(e.type)
      isDragging = false
      isRightDragging = false
      isLeftDragging = false
    })
  }

  // document.addEventListener('DOMContentLoaded', initDragHandlers)
  initDragHandlers()
}

setTimeout(() => {
  // alert(1)
  main()
}, 100)
