import { Table } from './common/table.js'
import { TableMenu } from './common/menu.js'
import { TableKeyboard } from './common/key.js'
import { TableMouse } from './common/mouse.js'
import { TableRowResizer, TableColResizer } from './common/layout.js'
import { initTableDragEvents } from './common/drag.js'

document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLTableElement | null} */
  const tableElement = document.querySelector('.table')
  if (!tableElement) return

  const table = new Table(tableElement)

  new TableMenu(table)
  new TableKeyboard(table)
  new TableRowResizer(table)
  new TableColResizer(table)
  new TableMouse(table)
  initTableDragEvents(table)
})
