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
const { getComputedStyleByLocator, sleep, parseColorToHex } = require('@web-bench/test-util')
const { checkFileHasContent } = require('./utils/helpers')

const getAngle = async (locator) => {
  return await locator.evaluate((el) => {
    const style = window.getComputedStyle(el)
    const transform = style.transform

    if (transform === 'none') return 0

    // 解析 matrix 或 rotate 值
    const values = transform.split('(')[1].split(')')[0].split(',')
    const a = values[0]
    const b = values[1]
    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))

    return angle
  })
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  const footer = page.locator('.site-footer')
  const button = footer.locator('button:has-text("My Friends")')
  await button.click()

  // wait for modal animation
  await sleep(1000)
})

test('Check styled(Modal) in Footer.tsx exists', () => {
  checkFileHasContent('components/Footer.tsx', 'styled(Modal)')
})

test('Check Background Color of Modal Overlay in Footer', async ({ page }) => {
  const overlay = page.locator('.modal-overlay')
  const overlayStyle = await getComputedStyleByLocator(overlay)

  expect(parseColorToHex(overlayStyle.backgroundColor)).toBe('#ff69b4')
  expect(overlayStyle.opacity).toBe('0.3')
})

test.describe('Test Cute Animals swing their heads', () => {
  for (const animal of '🐶🐱🐭🐹🐰🦊🐻🐼') {
    test(`Check ${animal} swing its heads`, async ({ page }) => {
      const modal = page.locator('.modal')
      const animalLocator = modal.locator(`.animal:has-text("${animal}")`)
      await expect(animalLocator).toBeVisible()

      // rotate from -45deg to 45deg in 1s, and rotate back from 45deg to -45deg in 1s
      const angle1 = await getAngle(animalLocator)
      await sleep(1000)
      const angle2 = await getAngle(animalLocator)
      await sleep(1000)
      const angle3 = await getAngle(animalLocator)

      expect(angle2 - angle1).toBeCloseTo(-90, -1.5)
      expect(angle3 - angle2).toBeCloseTo(90, -1.5)
    })
  }
})
