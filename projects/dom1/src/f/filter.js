import * as entry from './entry.js'

/**
 * @param {string} keyword
 * @param {Element} ent
 * @returns {boolean}
 */
function matchEntry(keyword, ent) {
  const name = entry.getName(ent).toLowerCase() ?? ''
  return name.includes(keyword.toLowerCase())
}

let lastKeyword = ''

/**
 * @param {string} keyword
 */
export function filterEntries(keyword) {
  if (!keyword.trim()) {
    // Show all entries if keyword is empty
    document.querySelectorAll('.entry').forEach((ent) => {
      if (!(ent instanceof HTMLElement)) return
      ent.style.display = ''
    })
    return
  }

  document.querySelectorAll('.entry').forEach((ent) => {
    if (!(ent instanceof HTMLElement)) return
    if (matchEntry(keyword, ent)) {
      ent.style.display = ''
      // If it's a matching file/dir, make sure its parent dirs are visible
      let parent = ent.parentElement

      while (parent && !parent?.classList.contains('entries')) {
        if (parent.classList.contains('dir')) {
          if (!parent.classList.contains('open')) parent.classList.add('open')
          parent.style.display = ''
        }
        parent = parent.parentElement
      }
    } else {
      ent.style.display = 'none'
    }
  })
}

export function showFilterDialog() {
  const keyword = prompt('Enter filter keyword:', lastKeyword)
  if (keyword !== null) {
    lastKeyword = keyword
    filterEntries(keyword)
  }
}
