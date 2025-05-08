/** @type {Element | null} */
let selectedEntry = null

// task-3
/** @param {Element | null} ent */
export function setSelectedEntry(ent) {
  /** @type {HTMLButtonElement | null} */
  const delButton = document?.querySelector('.tools button:nth-child(3)')

  const oldSelectedEntry = selectedEntry
  selectedEntry = ent

  // Effects
  oldSelectedEntry?.classList.remove('selected')
  selectedEntry?.classList.add('selected')
  if (selectedEntry?.classList.contains('dir')) {
    selectedEntry?.classList.toggle('open')
  }

  if (delButton) delButton.disabled = !selectedEntry
}

export function getSelectedEntry() {
  return selectedEntry
}
