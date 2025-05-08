// export const log = await import('./log.js')
export const PI = 3.1415926


/**
 * @param {number} value
 * @returns {number}
 */
export function square(value) {
  return value * value
}

/**
 * @param {number} value
 * @returns {number}
 */
export default function cube(value) {
  return value * value * value
}

globalThis.UNIT = 'celsius'

