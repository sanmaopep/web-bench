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

export const SVG_NS = 'http://www.w3.org/2000/svg'

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

export class BodyData {
  /** @type {string} */
  type
  /** @type {string} */
  name
  /** @type {string} */
  color
  /** @type {number} */
  r
  /** @type {BodyData[]} */
  bodies
}

export class StarData extends BodyData {
  type = 'star'
  /** @type {PlanetData[]} */
  bodies = []
}

export class SubbodyData extends BodyData {
  /** @type {number} */
  rx
  /** @type {number} */
  ry
  /** @type {number} */
  dur
}

export class PlanetData extends SubbodyData {
  type = 'planet'
  /** @type {SatelliteData[]} */
  bodies = []
}

export class CometData extends SubbodyData {
  type = 'comet'
}

export class SatelliteData extends SubbodyData {
  type = 'satellite'
}

export class EventEmitter {
  constructor() {
    this.events = new Map()
  }

  /**
   * @param {string} event
   * @param {any} callback
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event).push(callback)
    return this
  }

  /**
   * @param {string} event
   * @param {any[]} args
   */
  emit(event, ...args) {
    if (!this.events.has(event)) {
      return false
    }

    this.events.get(event).forEach((callback) => {
      callback.apply(this, args)
    })
    return true
  }

  /**
   * @param {string} event
   * @param {any} callback
   */
  once(event, callback) {
    const wrapper = (...args) => {
      callback.apply(this, args)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }

  /**
   * @param {string} event
   * @param {any} callback
   */
  off(event, callback) {
    if (!this.events.has(event)) {
      return this
    }

    if (!callback) {
      this.events.delete(event)
      return this
    }

    const listeners = this.events.get(event)
    const filteredListeners = listeners.filter((cb) => cb !== callback)

    if (filteredListeners.length) {
      this.events.set(event, filteredListeners)
    } else {
      this.events.delete(event)
    }

    return this
  }

  listenerCount(event) {
    if (!this.events.has(event)) {
      return 0
    }
    return this.events.get(event).length
  }

  rawListeners(event) {
    return this.events.get(event) || []
  }
}

export const eventBus = new EventEmitter()
export const PAUSE = 'pause'
export const RESUME = 'resume'
export const SHOW_DETAIL = 'show-detail'
export const HIDE_DETAIL = 'hide-detail'
export const GOTO_STAR_SYSTEM = 'goto-star-system'
export const GOTO_PLANET_SYSTEM = 'goto-planet-system'
export const INSERT_RESOURCE = 'insert-resource'
// export const TAIL_ENABLED = 'tail-enabled'

const gradientPrefix = /^(linearGradient|radialGradient):/
/**
 * @param {string} color "linearGradient:0% #ffd700, 50% #000000 0, 100% #ffd700"
 */
export function parseColor(color) {
  color = color.trim()
  const matches = color.match(gradientPrefix)
  if (!matches?.length) return color

  color = color.replace(gradientPrefix, '')
  const stops = color.split(',').map((stop) => {
    const matches = stop.trim().split(/\s+/)
    return {
      offset: matches[0].trim(),
      'stop-color': matches[1].trim(),
      'stop-opacity': matches[2]?.trim() ? parseFloat(matches[2].trim()) : 1,
    }
  })

  return {
    gradient: matches[1],
    stops,
  }
}

let uid = Date.now()
export function getUid() {
  return uid++
}

export const density = document.body.clientWidth / 160

export const config = {
  /** @type {boolean} */
  get orbitEnabled() {
    // @ts-ignore
    return !!document.querySelector('#orbitEnabled').checked
  },
  /** @type {boolean} */
  get tailEnabled() {
    // @ts-ignore
    return !!document.querySelector('#tailEnabled').checked
  },
  /** @type {number} */
  get speed() {
    // @ts-ignore
    return parseFloat(document.querySelector('#speed').value)
  },
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
