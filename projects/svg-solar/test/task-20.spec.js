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
  expectTolerance,
  getOffsetByLocator,
  getComputedStyleByLocator,
} = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('comet button', async ({ page }) => {
  await expect(page.locator('button#comet')).toBeVisible()
  await expect(page.locator('#comet:disabled')).not.toBeVisible()
})

test('comet button | planet-satellites', async ({ page }) => {
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  await expect(page.locator('#comet:disabled')).toBeVisible()
})

test('click comet', async ({ page }) => {
  const name = 'comet1'
  page.on('dialog', (dialog) => {
    if (dialog.type() === 'prompt') {
      dialog.accept(name)
    }
  })

  await expect(page.locator('.comet')).not.toBeVisible()
  await page.locator('#comet').click()
  await expect(page.locator('.comet')).toBeVisible()

  const orbit = page.locator(`#orbit_${name}`)
  await expect(orbit).toBeVisible()
  const offset = await getOffsetByLocator(orbit)
  const rx = offset.width / density / 2
  const ry = offset.height / density / 2
  // const dur = parseFloat((await page.locator(`.comet animateMotion`).getAttribute('dur')) ?? '0')
  // console.log({ rx, ry })

  await expect(rx >= 60 && rx <= 80).toBeTruthy()
  await expect(ry >= 2 && ry <= 4).toBeTruthy()
  // await expect(dur >= 200 && dur <= 400).toBeTruthy()
})
