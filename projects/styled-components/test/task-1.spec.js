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

const { test, expect } = require('@playwright/test')
const { getComputedStyle } = require('@web-bench/test-util')
const { checkExists } = require('./utils/helpers')
const path = require('path')
const fs = require('fs')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check global.style.tsx existed', async () => {
  checkExists('global.style.tsx')
})

test('Use styled-components to set style, CSS, Less, Scss File SHOULD NOT Exist', async () => {
  const CSS_EXTENSIONS = ['.css', '.less', '.scss']

  let hasCssFile = false

  const traverse = (currentDir) => {
    const files = fs.readdirSync(currentDir)

    for (const file of files) {
      const filePath = path.join(currentDir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        traverse(filePath)
      } else if (CSS_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
        hasCssFile = true
        return
      }
    }
  }

  traverse(process.env['EVAL_PROJECT_ROOT'] || path.join(__dirname, '../src'))

  expect(hasCssFile).toBeFalsy()
})

test('Check Body Padding And Margin to be 0', async ({ page }) => {
  const style = await getComputedStyle(page, 'body')

  expect(style.padding).toBe('0px')
  expect(style.margin).toBe('0px')
})
