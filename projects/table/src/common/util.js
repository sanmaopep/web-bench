/**
 *
 * @param {number} raw
 * @param {number} min
 * @param {number} max
 */
export function clamp(raw, min, max) {
  if (min > max) [min, max] = [max, min]

  if (raw < min) return min
  else if (raw > max) return max
  else return raw
}

/**
 * @param {HTMLElement | SVGElement} el
 * @see https://stackoverflow.com/a/28222246/1835843
 */
export function getOffset(el) {
  const rect = el.getBoundingClientRect()
  const left = rect.left + window.scrollX
  const top = rect.top + window.scrollY
  const width = rect.width
  const height = rect.height

  return {
    left,
    top,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2,
    right: left + width,
    bottom: top + height,
  }
}
