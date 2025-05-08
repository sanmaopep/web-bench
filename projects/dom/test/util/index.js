const os = require('os')

/**
 * @param {import('@playwright/test').Locator} locator
 */
export async function getEntryName(locator) {
  return locator.evaluate((el) => {
    const firstTextNode = Array.from(el.childNodes).find((node) => node.nodeType === Node.TEXT_NODE)
    return firstTextNode?.nodeValue ?? ''
  })
}
export function getCmdKey() {
  const isMac = os.platform() === 'darwin'
  return isMac ? 'Meta' : 'Control'
}

export function getCmdKeyText() {
  const isMac = os.platform() === 'darwin'
  return isMac ? 'Cmd' : 'Ctrl'
}
