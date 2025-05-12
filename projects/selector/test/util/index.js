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
