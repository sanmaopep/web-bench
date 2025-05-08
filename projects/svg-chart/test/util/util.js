import config from '../../playwright.config'
import path from 'path'

const __dirname = import.meta.dirname

class ChartConfig {
  /** @type {string} */
  id
  /** @type {string} */
  type
  /** @type {ChartData} */
  data
  /** @type {ChartOptions=} */
  options
}

class ChartData {
  /** @type {string[]} */
  labels
  /** @type {ChartDataset[]} */
  datasets = []
}

class ChartDataset {
  /** @type {string} */
  label
  /** @type {number[]} */
  data
  /** @type {boolean} */
  hidden
}

class ChartOptions {
  /** @type {boolean} */
  legends
  /** @type {boolean} */
  grids
  /** @type {boolean} */
  axes
  /** @type {boolean} */
  datasets
  /** @type {boolean} */
  lineSmooth
  /** @type {string} */
  pointStyle
  /** @type {boolean} */
  dataLabels
  /** @type {boolean} */
  tooltips
  /** @type {boolean} */
  axesArrows
}

export const src = process.env['EVAL_PROJECT_ROOT'] || path.resolve(__dirname, '../../src')
const _data = await import(path.join(src, 'assets/data.js'))
/** @type {{[k:string]: ChartConfig}} */
export const configs = _data.configs
/** @type {ChartData} */
export const data = _data.data
// @ts-ignore
export const density = (config.projects[0].use?.viewport?.width ?? 1280) / 2 / 100

export class Rect {
  /** @type {number} */
  left
  /** @type {number} */
  top
  /** @type {number} */
  right
  /** @type {number} */
  bottom
  /** @type {number} */
  width
  /** @type {number} */
  height
  /** @type {number} */
  centerX
  /** @type {number} */
  centerY
}

export const { min, max } = Math

/**
 * @param {Rect[]} rects
 * @returns {Rect}
 */
export function getUnionRect(rects) {
  const rect = {
    left: min(...rects.map((r) => r.left)),
    top: min(...rects.map((r) => r.top)),
    right: max(...rects.map((r) => r.right)),
    bottom: max(...rects.map((r) => r.bottom)),
  }

  rect.width = rect.right - rect.left
  rect.height = rect.bottom - rect.top
  rect.centerX = (rect.right + rect.left) / 2
  rect.centerY = (rect.bottom + rect.top) / 2

  // @ts-ignore
  return rect
}

export function hasUniqueValues(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr.indexOf(arr[i]) !== i) {
      return false
    }
  }
  return true
}

export function hasSameValue(arr) {
  if (!arr || arr.length === 0) return true
  const firstValue = arr[0]
  return arr.every((item) => item === firstValue)
}

export function isAscending(arr) {
  if (!arr || arr.length <= 1) return true

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] <= arr[i - 1]) {
      return false
    }
  }
  return true
}

export function doRectanglesIntersect(rect1, rect2) {
  // Check if either rectangle is to the side of the other
  if (rect1.x + rect1.width < rect2.x || rect2.x + rect2.width < rect1.x) {
    return false
  }

  // Check if either rectangle is above/below the other
  if (rect1.y + rect1.height < rect2.y || rect2.y + rect2.height < rect1.y) {
    return false
  }

  // If we get here, the rectangles overlap
  return true
}

export function length(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}
