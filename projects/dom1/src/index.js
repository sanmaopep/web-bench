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

import * as dir from './f/dir.js'
import * as file from './f/file.js'
import { addDragEvents } from './f/drag.js'
import * as entry from './f/entry.js'
import { initContextMenu, showContextMenu } from './f/menu.js'
import { setSelectedEntry } from './f/sel.js'
import { handleEdit } from './f/editor.js'
import { initResizer } from './f/resizer.js'
import { showFilterDialog } from './f/filter.js'

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.tools button') ?? []
  buttons[0].addEventListener('click', (e) => file.addTo())
  buttons[1].addEventListener('click', (e) => dir.addTo())
  buttons[2].addEventListener('click', (e) => entry.remove())
  buttons[3].addEventListener('click', (e) => entry.importAll())
  buttons[4].addEventListener('click', (e) => entry.exportAll())
  buttons[5].addEventListener('click', (e) => entry.generateEntries())
  buttons[6].addEventListener('click', (e) => showFilterDialog())

  const entriesPanel = document.querySelector('.entries')
  entriesPanel?.addEventListener('click', (event) => {
    /** @type {DOMTokenList} */
    // @ts-ignore
    const classList = event.target?.classList
    if (classList.contains('entries')) {
      setSelectedEntry(null)
    } else if (classList.contains('entry')) {
      entry.handleClick(event)
    }
  })
  addDragEvents(entriesPanel)
  initContextMenu()
  entriesPanel?.addEventListener('contextmenu', (event) => {
    event.preventDefault()

    /** @type {HTMLElement} */
    // @ts-ignore
    const target = event.target
    if (target.classList.contains('entry') || target.classList.contains('entries')) {
      event.preventDefault()
      // @ts-ignore
      showContextMenu(target, event.pageX, event.pageY)
    }
  })

  // @ts-ignore
  document.querySelector('.editor')?.addEventListener('keyup', (e) => handleEdit(e))

  initResizer()
})
