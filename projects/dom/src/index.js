import * as dir from './common/dir.js'
import * as file from './common/file.js'
import { addDragEvents } from './common/drag.js'
import * as entry from './common/entry.js'
import { initContextMenu, showContextMenu } from './common/menu.js'
import { setSelectedEntry } from './common/sel.js'
import { handleEdit } from './common/editor.js'
import { initResizer } from './common/resizer.js'
import { showFilterDialog } from './common/filter.js'

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
