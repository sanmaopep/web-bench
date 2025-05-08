import { addDragEvents } from './drag.js'
import * as entry from './entry.js'
import { setSelectedEntry } from './sel.js'

// state
let uid = 0

// task-2
function generateId() {
  return `file-${uid++}`
}

/**
 * @param {Element} ent
 */
export function handleClick(ent) {
  setSelectedEntry(ent)

  // effects
  const editor = document.querySelector('.editor')
  if (editor) {
    // @ts-ignore
    editor.value = ent.getAttribute('data-content')
    editor.setAttribute('data-file-id', ent.getAttribute('id') ?? '')
  }
}

/**
 * @param {string} name
 * @param {string} content
 */
export function createElement(name, content) {
  const ent = document.createElement('div')
  ent.classList.add('entry')
  ent.classList.add('file')
  const id = generateId()
  ent.id = id
  ent.textContent = name || id
  ent.setAttribute('data-content', content)

  return ent
}

/**
 * @param {Element | null} [targetEntry]
 * @param {string} [name]
 * @param {string} [content]
 */
export function addTo(
  targetEntry,
  name = `${generateId()}.txt`,
  content = `file content from ${name}`
) {
  const ent = createElement(name, content)
  addDragEvents(ent)
  entry.insert(ent, targetEntry)
}

/**
 * @param {Element} ent
 */
export function clone(ent) {
  /** @type {Element} */
  // @ts-ignore
  const clonedEntry = ent.cloneNode(true)
  clonedEntry.id = generateId()

  return clonedEntry
}

/**
 * @param {Element} ent
 */
export function toJSON(ent) {
  return { type: 'file', name: entry.getName(ent), content: ent.getAttribute('data-content') }
}

/**
 * @param {Element} ent
 */
export function isFile(ent) {
  return ent.classList.contains('file')
}
