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
