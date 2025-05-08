const fs = require('fs')
const path = require('path')

const src = process.env['EVAL_PROJECT_ROOT'] || path.resolve(__dirname, '../../src')

module.exports = {
  async getCSSText(page) {
    return page.evaluate(() => {
      function getActiveStylesheetContent() {
        let cssText = ''
        Array.from(document.styleSheets).forEach((sheet) => {
          try {
            if (sheet.disabled) return
            Array.from(sheet.cssRules || sheet.rules).forEach((rule) => {
              cssText += rule.cssText + '\n'
            })
          } catch (e) {
            console.warn(`Could not access stylesheet: ${sheet.href}`, e)
          }
        })

        return cssText
      }

      return getActiveStylesheetContent()
    })
  },

  async getCssRawText(page) {
    return page.evaluate(() => {
      return document.querySelector('style')?.textContent
    })
    // const _data = fs.readFileSync(path.join(src, 'index.html'))
  },

  /**
   * @param {string} rgbString
   * @returns {number[]}
   */
  rgbString2hsl(rgbString) {
    const rgb = rgbString.match(/\d+/g)?.map(Number)
    return rgb ? module.exports.rgb2hsl(rgb[0], rgb[1], rgb[2]) : [0, 0, 0]
  },

  /**
   * @param {string} lchString
   * @returns {number[]}
   */
  lchString2lch(lchString) {
    const lch = lchString.match(/\d+/g)?.map(Number)
    return lch ? lch.slice(0, 3) : [0, 0, 0]
  },

  /**
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @returns {number[]}
   */
  rgb2hsl(r, g, b) {
    ;(r /= 255), (g /= 255), (b /= 255) // Normalize RGB values to range [0, 1]

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min

    let h = 0,
      s = 0,
      l = (max + min) / 2 // Calculate lightness

    if (delta !== 0) {
      // If not grayscale
      s = delta / (1 - Math.abs(2 * l - 1)) // Calculate saturation
      switch (max) {
        case r:
          h = ((g - b) / delta) % 6
          break
        case g:
          h = (b - r) / delta + 2
          break
        case b:
          h = (r - g) / delta + 4
          break
      }
      h = Math.round(h * 60)
      if (h < 0) h += 360
    }

    return [h, Math.round(s * 100), Math.round(l * 100)] // Return [Hue, Saturation, Lightness]
  },
}
