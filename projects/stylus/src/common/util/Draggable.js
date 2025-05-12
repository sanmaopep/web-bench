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

import { getOffset } from './util.js'

/** @typedef { 'bottom'|'top'|'right'|'left' } DropSide */
/** @typedef { (side: DropSide, sourceItem: HTMLElement, targetItem: HTMLElement) =>void } onDropCallback */
/** @typedef { 'vertical'|'horizontal' } DragDirection */

export class Draggable {
  /** @type {HTMLElement} */
  item
  /** @type {HTMLElement} */
  container
  /** @type {DragDirection} */
  direction
  /** @type {string} */
  itemSelector
  /** @type {string} */
  draggingClass
  /** @type {string} */
  dragoverClass
  /** @type {string} */
  dragoverAboveClass
  /** @type {onDropCallback | undefined} */
  onDrop

  /**
   * @param {HTMLElement} item
   * @param {object} [options]
   * @param {DragDirection} [options.direction] default 'vertical'
   * @param {HTMLElement} [options.container] default document.body
   * @param {string} [options.itemSelector] default `.${item.classList.item(0)}`
   * @param {string} [options.draggingClass] default 'dragging'
   * @param {string} [options.dragoverClass] default 'dragover'
   * @param {string} [options.dragoverAboveClass] default 'dragover-above'
   * @param {onDropCallback} [options.onDrop] default undefined
   */
  constructor(item, options = {}) {
    if (!item.id) throw new Error(`draggable item's id can not be empty!`)
    if (item.classList.length === 0) throw new Error(`draggable item's classList can not be empty!`)

    this.item = item
    this.container = options.container ?? document.body
    this.direction = options.direction ?? 'vertical'
    this.itemSelector = options.itemSelector ?? `.${item.classList.item(0)}`
    this.draggingClass = options.draggingClass ?? 'dragging'
    this.dragoverClass = options.draggingClass ?? 'dragover'
    this.dragoverAboveClass = options.draggingClass ?? 'dragover-above'
    this.onDrop = options.onDrop

    item.draggable = true
    item.addEventListener('dragstart', this.start.bind(this))
    item.addEventListener('dragend', this.end.bind(this))
    item.addEventListener('dragover', this.over.bind(this))
    item.addEventListener('dragleave', this.leave.bind(this))
    item.addEventListener('drop', this.drop.bind(this))
  }

  /**
   * @param {DragEvent} e
   */
  start(e) {
    e.stopPropagation()
    this.item.classList.add(this.draggingClass)
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', this.item.id)
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  /**
   * @param {DragEvent} e
   */
  end(e) {
    e.stopPropagation()
    this.item.classList.remove(this.draggingClass)
    this.container.querySelectorAll(this.itemSelector).forEach((el) => {
      el.classList.remove(this.dragoverClass, this.dragoverAboveClass)
    })
  }

  /**
   * @param {DragEvent} e
   */
  over(e) {
    const { item } = this
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }

    item.classList.remove(this.dragoverClass, this.dragoverAboveClass)
    const side = this.getSide(e, getOffset(item))
    switch (side) {
      case 'bottom':
      case 'right':
        item.classList.add(this.dragoverClass)
        break

      case 'top':
      case 'left':
        item.classList.add(this.dragoverAboveClass)
        break
    }
  }

  /**
   * @param {DragEvent} e
   */
  leave(e) {
    const { item } = this
    e.stopPropagation()
    item.classList.remove(this.dragoverClass, this.dragoverAboveClass)
  }

  /**
   * @param {DragEvent} e
   */
  drop(e) {
    const { item, onDrop } = this
    e.preventDefault()
    e.stopPropagation()

    const sourceItemId = e.dataTransfer?.getData('text/plain') ?? ''
    const sourceItem = document.getElementById(sourceItemId)
    const targetItem = item

    if (!sourceItem) return
    if (sourceItem === targetItem) return

    // Remove dragover styling
    targetItem.classList.remove(this.dragoverClass, this.dragoverAboveClass)

    console.log(Draggable.name, { x: e.pageX, y: e.pageY, sourceItem, targetItem })
    const targetOffset = getOffset(targetItem)

    const side = this.getSide(e, targetOffset)
    switch (side) {
      case 'bottom':
      case 'right':
        targetItem.after(sourceItem)
        break

      case 'top':
      case 'left':
        targetItem.before(sourceItem)
        break
    }

    if (onDrop) onDrop(side, sourceItem, targetItem)
  }

  /**
   * @param {MouseEvent} e
   * @param {ReturnType<getOffset>} targetOffset
   * @returns {DropSide}
   */
  getSide(e, targetOffset) {
    return this.direction === 'vertical' ? 'bottom' : 'right'
    // return this.direction === 'vertical'
    //   ? e.pageY >= targetOffset.centerY
    //     ? 'bottom'
    //     : 'top'
    //   : e.pageX >= targetOffset.centerX
    //   ? 'right'
    //   : 'left'
  }
}
