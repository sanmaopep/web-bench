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

import { setSelectedEntry } from './sel.js'

// task-6 Drag and drop
/**
 * @param {HTMLElement | SVGElement} el
 * @see https://stackoverflow.com/a/28222246/1835843
 */
function getOffset(el) {
  const rect = el.getBoundingClientRect()
  const left = rect.left + window.scrollX
  const top = rect.top + window.scrollY
  const width = rect.width
  const height = rect.height

  return {
    left,
    top,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2,
    right: left + width,
    bottom: top + height,
  }
}

const handleDrag = {
  /** @param {DragEvent} e */
  start(e) {
    e.stopPropagation()
    this.classList.add('dragging')
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', this.id)
      e.dataTransfer.effectAllowed = 'move'
    }
  },
  /** @param {DragEvent} e */
  end(e) {
    e.stopPropagation()
    this.classList.remove('dragging')
    document.querySelectorAll('.entry').forEach((ent) => {
      ent.classList.remove('dragover')
    })
  },
  /** @param {DragEvent} e */
  over(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }
    this.classList.add('dragover')
  },
  /** @param {DragEvent} e */
  leave(e) {
    e.stopPropagation()
    this.classList.remove('dragover')
  },
  /** @param {DragEvent} e */
  drop(e) {
    e.preventDefault()
    e.stopPropagation()

    const entriesPanel = document.querySelector('.leftbar .entries')
    const draggedId = e.dataTransfer?.getData('text/plain') ?? ''
    const draggedEntry = document.getElementById(draggedId)
    /** @type {HTMLElement} e */
    // @ts-ignore
    const dropTarget = this

    if (!draggedEntry) return
    if (draggedEntry === dropTarget) return

    // Remove dragover styling
    dropTarget.classList.remove('dragover')

    if (dropTarget === entriesPanel) {
      entriesPanel.appendChild(draggedEntry)
    }
    // Handle dropping into directory
    else if (dropTarget.classList.contains('dir')) {
      console.log('mouse X:', e.clientX, 'Y:', e.clientY)
      const offset = getOffset(dropTarget)
      if (e.clientX < offset.centerX) {
        const dirContent = dropTarget.querySelector('.dir-content')
        if (!dropTarget.classList.contains('open')) {
          dropTarget.classList.add('open')
        }
        dirContent?.appendChild(draggedEntry)
      } else {
        dropTarget.after(draggedEntry)
      }
    }
    // Handle dropping between entries
    else {
      dropTarget.after(draggedEntry)
    }

    setSelectedEntry(draggedEntry)
  },
}

// Update entry creation to add drag events
export function addDragEvents(ent) {
  ent.draggable = true
  ent.addEventListener('dragstart', handleDrag.start)
  ent.addEventListener('dragend', handleDrag.end)
  ent.addEventListener('dragover', handleDrag.over)
  ent.addEventListener('dragleave', handleDrag.leave)
  ent.addEventListener('drop', handleDrag.drop)
}
