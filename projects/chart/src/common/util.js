// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @param {string} selector
 * @returns {any}
 */
export function $(selector) {
  return document.querySelector(selector)
}

/**
 * @param {string} selector
 * @returns {any[]}
 */
export function $All(selector) {
  return [...document.querySelectorAll(selector)]
}

export const SVG_NS = 'http://www.w3.org/2000/svg'

export class ChartConfig {
  /** @type {string} */
  id
  /** @type {string} */
  type
  /** @type {ChartData} */
  data
  /** @type {ChartOptions=} */
  options
}

export class ChartData {
  /** @type {string[]} */
  labels
  /** @type {ChartDataset[]} */
  datasets = []
}

export class ChartDataset {
  /** @type {string} */
  label
  /** @type {number[]} */
  data
  /** @type {boolean} */
  hidden
}

export class ChartOptions {
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
  /** @type {number} */
  gridXCount
}

export class Point {
  /** @type {number} */
  x
  /** @type {number} */
  y

  /**
   * @param {Point} point
   * @param {Rect} rect
   */
  static isInRect(point, rect) {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    )
  }
}

export class Rect {
  /** @type {number} */
  x
  /** @type {number} */
  y
  /** @type {number} */
  width
  /** @type {number} */
  height
}
export function getIndexArray(length) {
  const arr = []
  for (let i = 0; i < length; i++) {
    arr.push(i)
  }
  return arr
  // return new Array(length).fill(0)
}

export const { min, max, abs } = Math

/**
 *
 * @param {ChartDataset[]} datasets
 */
export function getMinMaxValue(datasets) {
  return {
    min: min(...datasets.map((d) => min(...d.data))),
    max: max(...datasets.map((d) => max(...d.data))),
  }
}

// @ts-ignore
export const DENSITY = document.querySelector('#chart')?.clientWidth / 100
export const RAD = Math.PI / 180
