import { Table } from './table.js'

export class TableMouse {
  /** @type {Table} */
  table

  isMouseDown = false
  /** @type {HTMLTableCellElement} */
  mousedownCell

  /** @param {Table} table */
  constructor(table) {
    this.table = table
    const { tableEl } = table

    tableEl.addEventListener('mousedown', (event) => {
      if (!(event.target instanceof HTMLTableCellElement)) return

      this.isMouseDown = true
      this.mousedownCell = event.target
      // console.log('mousedown', event.target)
    })

    tableEl.addEventListener('mousemove', (event) => {
      if (!this.isMouseDown) return
      // console.log('mousemove', { isMouseDown: this.isMouseDown, target: event.target })

      if (!(event.target instanceof HTMLTableCellElement)) return
      const start = table.getCellIndex(this.mousedownCell)
      const end = table.getCellIndex(event.target)
      if (start.row !== end.row || start.col !== end.col) {
        table.selectedCells = table.getRectCellsBy(start, end)
      }
    })

    tableEl.addEventListener('mouseup', (event) => {
      this.isMouseDown = false
      // console.log('mouseup', { isMouseDown: this.isMouseDown })
    })

    tableEl.addEventListener('mouseleave', (event) => {
      this.isMouseDown = false
      // console.log('mouseleave', { isMouseDown: this.isMouseDown })
    })
  }
}
