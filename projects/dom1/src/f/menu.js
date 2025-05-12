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

import * as dir from './dir.js'
import { isDir } from './dir.js'
import { isFile } from './file.js'
import * as file from './file.js'
import * as entry from './entry.js'
import { getSelectedEntry } from './sel.js'

/** @type {HTMLElement | null} */
let contextMenu = null
/** @type {Element | null} */
let copiedEntry = null
let isCut = false

export function initContextMenu() {
  contextMenu = document.createElement('div')
  contextMenu.className = 'menu'
  document.body.appendChild(contextMenu)

  // Hide context menu on any click outside
  document.addEventListener('click', () => {
    if (contextMenu) contextMenu.style.display = 'none'
  })

  // Setup global keydown listener for shortcuts
  document.addEventListener('keydown', handleShortcuts, false)
  // document.querySelector('.entries')?.addEventListener('keydown', handleShortcuts)
}

/**
 * @param {Element} ent
 */
function isEntries(ent) {
  return ent.classList.contains('entries')
}

/**
 * @param {KeyboardEvent} e
 */
function handleShortcuts(e) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const cmdKey = isMac ? e.metaKey : e.ctrlKey
  const shiftKey = e.shiftKey
  const altKey = e.altKey
  const ent = getSelectedEntry() ?? document.querySelector('.entries')
  const key = e.key.toLowerCase()
  const focusdElement = document.activeElement

  // console.log({ isMac, cmdKey, shiftKey, altKey, key, ent, focusdElement })

  if (['textarea', 'input'].includes(focusdElement?.tagName.toLowerCase() ?? '')) return
  if (!ent) return

  if (cmdKey) {
    switch (key) {
      case 'x': // Cmd/Ctrl + X
        if (isDir(ent) || isFile(ent)) {
          copiedEntry = ent
          isCut = true
          e.preventDefault()
        }
        break
      case 'c': // Cmd/Ctrl + C
        if (isDir(ent) || isFile(ent)) {
          copiedEntry = ent
          isCut = false
          e.preventDefault()
        }
        break
      case 'v': // Cmd/Ctrl + V
        if (copiedEntry) {
          if (isCut) entry.remove(copiedEntry)
          entry.paste(copiedEntry, ent)
          e.preventDefault()
        }
        break
      case 'j': // Cmd/Ctrl + J
        file.addTo(ent)
        e.preventDefault()
        break
      case 'k': // Cmd/Ctrl + K
        dir.addTo(ent)
        e.preventDefault()
        break
    }
  } else if ((key === 'delete' || key === 'backspace') && (isDir(ent) || isFile(ent))) {
    entry.remove(ent)
    e.preventDefault()
  }
}

function getShortcut(command) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const cmdKey = isMac ? 'Cmd' : 'Ctrl'
  switch (command.toLowerCase()) {
    case 'cut':
      return ` (${cmdKey}+X)`
    case 'add file':
      return ` (${cmdKey}+J)`
    case 'add dir':
      return ` (${cmdKey}+K)`
    case 'delete':
      return ' (Delete|Backspace)'
    case 'copy':
      return ` (${cmdKey}+C)`
    case 'paste':
      return ` (${cmdKey}+V)`
    default:
      return ''
  }
}

/**
 * @param {string} command
 * @param {HTMLElement} ent
 */
function registerMenuitem(command, ent) {
  if (!contextMenu) return

  const menuitem = document.createElement('div')
  menuitem.className = `menu-item menu-item-${command.toLowerCase().replace(/\s+?/g, '-')}`
  menuitem.textContent = command + getShortcut(command)
  switch (command.toLowerCase()) {
    case 'cut':
      menuitem.addEventListener('click', (e) => {
        copiedEntry = ent
        isCut = true
      })
      break
    case 'add file':
      menuitem.addEventListener('click', (e) => file.addTo(ent))
      break
    case 'add dir':
      menuitem.addEventListener('click', (e) => dir.addTo(ent))
      break
    case 'delete':
      menuitem.addEventListener('click', (e) => entry.remove(ent))
      break
    case 'copy':
      menuitem.addEventListener('click', (e) => {
        copiedEntry = ent
        isCut = false
      })
      break
    case 'paste':
      menuitem.addEventListener('click', (e) => {
        if (copiedEntry) {
          if (isCut) entry.remove(copiedEntry)
          entry.paste(copiedEntry, ent)
        }
      })
      break
    case 'rename':
      menuitem.addEventListener('click', (e) => entry.rename(ent))
      break
  }

  contextMenu.appendChild(menuitem)
}

export function showContextMenu(ent, x, y) {
  if (!contextMenu) return

  contextMenu.innerHTML = ''
  if (isEntries(ent)) {
    registerMenuitem('Add File', ent)
    registerMenuitem('Add Dir', ent)
    if (copiedEntry) registerMenuitem('Paste', ent)
  } else if (isDir(ent)) {
    registerMenuitem('Add File', ent)
    registerMenuitem('Add Dir', ent)
    registerMenuitem('Rename', ent)
    registerMenuitem('Cut', ent)
    registerMenuitem('Copy', ent)
    registerMenuitem('Delete', ent)
    if (copiedEntry) registerMenuitem('Paste', ent)
  } else if (isFile(ent)) {
    registerMenuitem('Rename', ent)
    registerMenuitem('Cut', ent)
    registerMenuitem('Copy', ent)
    registerMenuitem('Delete', ent)
  }

  contextMenu.style.display = 'block'
  contextMenu.style.left = `${x}px`
  contextMenu.style.top = `${y}px`
}
