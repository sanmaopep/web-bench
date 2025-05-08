import * as dir from './dir.js'
import * as file from './file.js'
import { getSelectedEntry, setSelectedEntry } from './sel.js'

/**
 * @param {Event} event
 */
export function handleClick(event) {
  event.stopPropagation()
  /** @type {Element} */
  // @ts-ignore
  const ent = event.target
  if (!ent) return
  if (ent.classList?.contains('file')) {
    file.handleClick(ent)
  } else if (ent?.classList?.contains('dir')) {
    dir.handleClick(ent)
  }
}

// task-2
/**
 * @param {Element} ent
 * @param {Element | null} [targetEntry]
 */
export function insert(ent, targetEntry) {
  targetEntry = targetEntry ?? getSelectedEntry()

  if (!targetEntry || targetEntry.classList.contains('entries')) {
    document.querySelector('.entries')?.appendChild(ent)
  } else {
    if (targetEntry.classList.contains('file')) {
      targetEntry.after(ent)
    } else if (targetEntry.classList.contains('dir')) {
      if (!targetEntry.classList.contains('open')) targetEntry.classList.add('open')
      targetEntry.querySelector('.dir-content')?.appendChild(ent)
    }
  }

  setSelectedEntry(ent)

  return ent
}

// task-5
/**
 * @param {Element | null} [ent]
 */
export function remove(ent) {
  if (!ent) ent = getSelectedEntry()
  if (!ent) return

  // before delete
  /** @type {Element | null | undefined} */
  let nextEntry = ent.nextElementSibling
  if (!nextEntry) {
    nextEntry = ent.previousElementSibling
    if (!nextEntry) {
      // dir / dir-content / child
      nextEntry = ent.parentElement?.closest('.entry.dir')
    }
  }

  // delete
  // TODO only clear editor content if associated to the file
  if (ent.classList.contains('file')) {
    /** @type {HTMLTextAreaElement | null} */
    const editor = document.querySelector('.editor')
    if (editor && editor.value === ent.getAttribute('data-content')) editor.value = ''
  }
  ent.remove()

  // after delete
  if (!nextEntry) {
    setSelectedEntry(null)
  } else {
    // @ts-ignore
    nextEntry.click()
    if (nextEntry.classList.contains('dir') && !nextEntry.classList.contains('open')) {
      nextEntry.classList.add('open')
    }
  }
}

/**
 * @param {Element} ent
 */
export function clone(ent) {
  if (ent.classList.contains('file')) {
    return file.clone(ent)
  } else if (ent.classList.contains('dir')) {
    return dir.cloneDir(ent)
  }
}

/**
 * @param {Element} copiedEntry
 * @param {Element} targetEntry
 */
export function paste(copiedEntry, targetEntry) {
  const isOpen = copiedEntry.classList.contains('open')
  const clonedEntry = clone(copiedEntry)
  if (clonedEntry) {
    insert(clonedEntry, targetEntry)
    if (clonedEntry.classList.contains('dir')) {
      if (isOpen) clonedEntry.classList.add('open')
      else clonedEntry.classList.remove('open')
    }
  }
}

// task-10
/**
 * @param {Element} ent
 */
export function rename(ent) {
  const currentName = getName(ent)
  let newName = prompt('Rename entry:', currentName)
  if (!newName || !newName.trim()) return

  newName = newName.trim()
  if (newName !== currentName) {
    const childNodes = ent.parentElement?.querySelectorAll('.entry')
    if (childNodes) {
      const isDuplicated = Array.from(childNodes).some(
        (childNode) => childNode !== ent && getName(childNode) === newName
      )

      if (!isDuplicated) {
        setName(ent, newName)
      } else {
        console.warn(`newName '${newName}' duplicated`)
      }
    }
  }
}

/**
 * @param {Element} ent
 */
export function getName(ent) {
  const firstTextNode = Array.from(ent.childNodes).find((node) => node.nodeType === Node.TEXT_NODE)
  return firstTextNode?.nodeValue?.trim() ?? ''
}

/**
 * @param {Element} ent
 * @param {string} newName
 */
export function setName(ent, newName) {
  const firstTextNode = Array.from(ent.childNodes).find((node) => node.nodeType === Node.TEXT_NODE)
  if (firstTextNode) {
    firstTextNode.nodeValue = newName
  }
}

/**
 * @param {Element} ent
 */
export function toJSON(ent) {
  if (ent.classList.contains('file')) {
    return file.toJSON(ent)
  } else if (ent.classList.contains('dir')) {
    return dir.toJSON(ent)
  }
  return {}
}

export async function exportAll() {
  /** @type {Element[]} */
  const ents = Array.from(document.querySelectorAll('.entries > .entry') ?? [])
  const data = {
    entries: ents.map((ent) => toJSON(ent)),
  }

  alert(JSON.stringify(data))

  // Complicated custom certificate permission for HTTPS
  // navigator.clipboard.writeText(JSON.stringify(data))
}

export async function importAll() {
  try {
    // Complicated custom certificate permission for HTTPS
    // const text = await navigator.clipboard.readText()
    const text = prompt('JSON data to import:')
    if (!text) return

    const data = JSON.parse(text)
    if (data && Array.isArray(data.entries)) {
      // @ts-ignore
      const entries = document.querySelector('.entries')
      if (!entries) return
      entries.innerHTML = ''
      setSelectedEntry(null)

      data.entries.forEach((ent) => importEntry(ent, entries))
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 *
 * @param {Element | null} [parentEnt]
 */
export function importEntry(ent, parentEnt) {
  if (ent.type === 'file') {
    file.addTo(parentEnt, ent.name, ent.content)
  } else if (ent.type === 'dir') {
    const dirEnt = dir.addTo(parentEnt, ent.name)
    ent.children.forEach((childEnt) => importEntry(childEnt, dirEnt))
  }
}

export function generateEntries() {
  const entries = document.querySelector('.entries')
  for (let i = 0; i < 100; i++) {
    generateEntry(entries)
  }
}

/**
 * @param {number} n
 * @param {number} m
 * @returns integer in [m, n)
 */
function randomInt(n, m = 0) {
  return m + Math.floor(Math.random() * n)
}

export function generateEntry(targetEntry) {
  const isFile = randomInt(2) === 0
  if (isFile) {
    file.addTo(targetEntry)
  } else {
    const ent = dir.addTo(targetEntry)
    for (let i = 0; i < 10; i++) {
      randomInt(2) === 0 ? file.addTo(ent) : dir.addTo(ent)
      // generateEntry(ent)
    }
  }
}
