# web-bench-table

## [Evaluate](../readme.md)

## Introduction

from [WHATWG HTML Spec](https://html.spec.whatwg.org/multipage/tables.html#the-table-element)

> The table element represents data with more than one dimension, in the form of a table.

from [MDN-Table](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)

> The **`<table>`** [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) element represents tabular data—that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.

## Project Design

We will create a minimal spreadsheet application. Typical Spreadsheet features are:

Basic features:

1. Create a table
2. Context menu & shortcut
3. Insert/Delete row/col
4. Select cell/cells
5. Select rows/cols
6. Clear cell/cells
7. Copy and paste
8. Drag to adjust row/col height/width

Advanced features:

1. Move rows/cols
2. Filter from header
3. Sort from header
4. Simple expression

### Tasks

1. Context Menu
2. Insert/Delete Row
3. Insert/Delete Column
4. Select a Cell
5. Arrow Keys
6. Tab Key
7. Select Row/Column/All
8. Clear Selected Contents
9. Shift+Arrow, Select Cells
10. Mouse Drag, Select Cells
11. Edit
12. Enter/Escape Key
13. Copy/Paste a Cell
14. Copy/Paste Cells
15. Adjust Row Height
16. Adjust Column Width
17. Drag and Move a Row
18. Drag and Move a Column
19. Filter
20. Sort

### Feature Coverage

- cells: td, th

| HTML Element | for Element(s)   | Used |
| ------------ | ---------------- | ---- |
| `<table>`    | -                | ✅   |
| `<caption>`  | `table`          | ✅   |
| `<thead>`    | `table`          | ✅   |
| `<colgroup>` | `table`          | -    |
| `<col>`      | `colgroup`       | -    |
| `<th>`       | `tr`             | ✅   |
| `<tbody>`    | `table`          | ✅   |
| `<tr>`       | `thead`, `tbody` | ✅   |
| `<td>`       | `tr`             | ✅   |
| `<tfoot>`    | `table`          | -    |

| HTML Attribute | for Element(s) | Used |
| -------------- | -------------- | ---- |
| colspan        | th, td         | -    |
| rowspan        | th, td         | -    |
| span           | col            | -    |
| headers        | td             | -    |
| cellIndex      | th, td         | ✅   |
| scope          | th             | -    |

| CSS Property    | for Element(s) | Used |
| :-------------- | -------------- | ---- |
| border-collapse | table          | ✅   |
| border-spacing  | table          | ✅   |
| width           | table, th, td  | ✅   |
| border          | th, td         | ✅   |
| vertical-align  | th, td         | ✅   |
| white-space     | th, td         | ✅   |

| JS API                           | Used |
| -------------------------------- | ---- |
| HTMLTableElement                 | ✅   |
| HTMLTableElement.rows            | ✅   |
| HTMLTableElement.insertRow()     | ✅   |
| HTMLTableRowElement              | ✅   |
| HTMLTableRowElement.cells        | ✅   |
| HTMLTableRowElement.rowIndex     | ✅   |
| HTMLTableRowElement.insertCell() | ✅   |
| HTMLTableCellElement             | ✅   |
| HTMLTableCellElement.cellIndex   | ✅   |

## Reference

- [WHATWG - Living Standard](https://html.spec.whatwg.org/multipage/tables.html)
- [MDN - Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)
- [MDN - Tutorial](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables)
- [CSS-Tricks - Tutorial](https://css-tricks.com/complete-guide-table-element/)
