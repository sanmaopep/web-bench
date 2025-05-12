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
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('do not use !important', async ({ page }) => {
  await expect(css).not.toContain('!important')
})

test('no content', async ({ page }) => {
  const before = await page.evaluate(() => {
    const element = document.querySelector('#table tr td')
    // @ts-ignore
    const style = window.getComputedStyle(element, '::before')
    return {
      content: style.getPropertyValue('content'),
    }
  })

  await expect(before.content.trim()).toEqual('"><"')
})

test('td', async ({ page }) => {
  await expect(page.locator(`#table tr:nth-child(4) td:nth-child(3)`)).toHaveCSS(
    'background-color',
    'rgb(211, 211, 211)'
  )
})
