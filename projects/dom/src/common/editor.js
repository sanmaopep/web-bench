/**
 *
 * @param {KeyboardEvent} e
 */
export function handleEdit(e) {
  e.stopPropagation()
  e.preventDefault()
  /** @type {HTMLTextAreaElement} */
  // @ts-ignore
  const editor = e.target
  if (!editor || !editor.hasAttribute('data-file-id')) return

  const fileId = editor.getAttribute('data-file-id') ?? ''
  const file = document.getElementById(fileId)
  if (file) {
    file.setAttribute('data-content', editor.value)
  }

}
