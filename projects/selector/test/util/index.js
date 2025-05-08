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
}
