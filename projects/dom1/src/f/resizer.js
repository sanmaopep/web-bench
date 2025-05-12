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
