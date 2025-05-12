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

import { addDragEvents } from './drag.js'
import * as entry from './entry.js'
import * as file from './file.js'
import { setSelectedEntry } from './sel.js'

// state
let uid = 0

// task-3
function generateId() {
  return `dir-${uid++}`
}

/**
 * @param {Element} ent
 */
export function handleClick(ent) {
  setSelectedEntry(ent)
}

/**
 * @param {string} name
 */
export function createElement(name) {
  const ent = document.createElement('div')
  ent.classList.add('entry')
  ent.classList.add('dir')
  const id = generateId()
  ent.id = id
  ent.textContent = name

  const dirContent = document.createElement('div')
  dirContent.className = 'dir-content'
  ent.appendChild(dirContent)

  return ent
}

/**
 * @param {Element | null} [targetEntry]
 * @param {string} [name]
 */
export function addTo(targetEntry, name = `${generateId()}`) {
  const ent = createElement(name)
  addDragEvents(ent)
  return entry.insert(ent, targetEntry)
}

/**
 * @param {Element} ent
 */
export function cloneDir(ent) {
  /** @type {Element} */
  // @ts-ignore
  const clonedEntry = ent.cloneNode(true)
  clonedEntry.id = generateId()

  clonedEntry.querySelectorAll('.dir-content > .entry').forEach((childEntry) => {
    let clonedChildEntry
    if (childEntry.classList.contains('file')) {
      clonedChildEntry = file.clone(childEntry)
    } else if (childEntry.classList.contains('dir')) {
      clonedChildEntry = cloneDir(childEntry)
    }

    if (clonedChildEntry) {
      childEntry.before(clonedChildEntry)
      childEntry.remove()
    }
  })

  return clonedEntry
}

/**
 * @param {Element} ent
 */
export function toJSON(ent) {
  return {
    type: 'dir',
    name: entry.getName(ent),
    children: Array.from(ent.querySelector('.dir-content')?.children ?? [])
      .filter((child) => child.classList.contains('entry'))
      .map((ent) => {
        if (ent.classList.contains('file')) {
          return file.toJSON(ent)
        } else if (ent.classList.contains('dir')) {
          return toJSON(ent)
        }
      }),
  }
}

/**
 * @param {Element} ent
 */
export function isDir(ent) {
  return ent.classList.contains('dir')
}