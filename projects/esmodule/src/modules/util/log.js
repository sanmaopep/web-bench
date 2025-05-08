/**
 * @param {string} id
 * @param {any} value
 */
export function log(id, value) {
  const item = document.createElement('li')
  item.id = id
  item.className = 'item'
  item.innerHTML = `${value}`
  document.querySelector('.log')?.append(item)
}

export async function getLangs() {
  return (await import('./lang.js')).langs
}
