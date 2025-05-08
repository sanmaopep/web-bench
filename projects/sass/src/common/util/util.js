/**
 * @param {Element} el
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

/**
 * @param {any[]} array
 * @returns {any[]}
 */
export function shuffle(array) {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle
  while (currentIndex > 0) {
    // Pick a remaining element randomly
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // Swap it with the current element
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
