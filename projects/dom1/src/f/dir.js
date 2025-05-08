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