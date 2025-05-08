import { Table } from './table.js'

export class TableRowResizer {
  isResizing = false
  /** @type {HTMLTableRowElement | null} */
  currentRow
  /** @type {number} */
  startY
  /** @type {number} */
  startHeight

  /** @param {Table} table */
  constructor(table) {
    document.addEventListener('mousedown', (e) => {
      if (!(e.target instanceof HTMLDivElement) || !e.target.classList.contains('row-resizer'))
        return

      this.isResizing = true
      this.currentRow = e.target.closest('tr')
      this.startY = e.clientY
      this.startHeight = this.currentRow?.offsetHeight ?? 0

      document.body.style.cursor = 'row-resize'
      e.preventDefault()
    })

    document.addEventListener('mousemove', (e) => {
      if (!this.isResizing) return

      const deltaY = e.clientY - this.startY
      const newHeight = Math.max(40, this.startHeight + deltaY)
      if (this.currentRow) this.currentRow.style.height = `${newHeight}px`
    })

    document.addEventListener('mouseup', () => {
      if (!this.isResizing) return

      this.isResizing = false
      this.currentRow = null
      document.body.style.cursor = 'default'
    })

    Array.from(table.tableEl.rows).forEach((row) => row.appendChild(createRowResizer()))
  }
}

export function createRowResizer() {
  const handle = document.createElement('div')
  handle.className = 'row-resizer'
  return handle
}

export class TableColResizer {
  isResizing = false
  /** @type {HTMLTableCellElement} */
  currentCell
  /** @type {HTMLTableColElement | null} */
  // currentCol
  /** @type {number} */
  startX
  /** @type {number} */
  startWidth

  /** @param {Table} table */
  constructor(table) {
    document.addEventListener('mousedown', (e) => {
      if (!(e.target instanceof HTMLDivElement) || !e.target.classList.contains('col-resizer'))
        return

      this.isResizing = true
      // @ts-ignore
      this.currentCell = e.target.closest('th')
      // this.currentCol = currentCell ? table.getCol(table.getCellIndex(currentCell).col) : null
      this.startX = e.clientX
      this.startWidth = this.currentCell?.offsetWidth ?? 0

      document.body.style.cursor = 'col-resize'
      e.preventDefault()
    })

    document.addEventListener('mousemove', (e) => {
      if (!this.isResizing) return

      const deltaX = e.clientX - this.startX
      const newWidth = Math.max(80, this.startWidth + deltaX)
      if (this.currentCell) this.currentCell.style.width = `${newWidth}px`
    })

    document.addEventListener('mouseup', () => {
      if (!this.isResizing) return

      this.isResizing = false
      document.body.style.cursor = 'default'
    })

    table.tableEl.querySelectorAll('thead th').forEach((th) => th.appendChild(createColResizer()))
  }
}

export function createColResizer() {
  const handle = document.createElement('div')
  handle.className = 'col-resizer'
  return handle
}
