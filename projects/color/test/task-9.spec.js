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
const {
  getComputedStyleByLocator,
  getOffsetByLocator,
  getViewport,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('#changeTheme', async ({ page }) => {
  const button = page.locator('#changeTheme')
  await expect(button).toBeVisible()

  const buttonOffset = await getOffsetByLocator(button)
  const viewport = await getViewport(page)
  await expectTolerance(buttonOffset.centerX, viewport.width / 2)
  await expectTolerance(buttonOffset.centerY, viewport.height - buttonOffset.height)
})

test('light-dark()', async ({ page }) => {
  const css = await page.evaluate(() => {
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

  // console.log('[css]', css)
  await expect(css.includes('color-scheme')).toBeTruthy()
  await expect(css.includes('light-dark')).toBeTruthy()
})

test('click #changeTheme', async ({ page }) => {
  await page.locator('body').evaluate((body) => {
    body.style.transition = 'none'
  })
  const body0 = await getComputedStyleByLocator(page.locator('body'))

  await page.locator('#changeTheme').click()
  const body1 = await getComputedStyleByLocator(page.locator('body'))

  await page.locator('#changeTheme').click()
  const body2 = await getComputedStyleByLocator(page.locator('body'))

  await expect(body0.backgroundColor).not.toBe(body1.backgroundColor)
  await expect(body2.backgroundColor).not.toBe(body1.backgroundColor)
  await expect(body2.backgroundColor).toBe(body0.backgroundColor)
})
