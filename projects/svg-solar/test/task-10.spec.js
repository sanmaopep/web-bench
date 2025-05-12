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
const { expectTolerance, getOffsetByLocator } = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()
})

test('press Escape', async ({ page }) => {
  await expect(page.locator('.star')).toHaveCount(0)
  await expect(page.locator('.planet')).toHaveCount(1)
  await expect(page.locator('.satellite')).toHaveCount(5)

  await page.keyboard.press('Escape')
  await expect(page.locator('.star')).toHaveCount(1)
  await expect(page.locator('.planet')).toHaveCount(8)
  await expect(page.locator('.satellite')).toHaveCount(0)
})

test('jump to planet again', async ({ page }) => {
  await page.keyboard.press('Escape')

  const offset = await getOffsetByLocator(page.locator('.earth'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.earth').click()

  await expect(page.locator('.star')).toHaveCount(0)
  await expect(page.locator('.planet')).toHaveCount(1)
  await expect(page.locator('.satellite')).toHaveCount(1)

  await page.keyboard.press('Escape')
  await expect(page.locator('.star')).toHaveCount(1)
  await expect(page.locator('.planet')).toHaveCount(8)
  await expect(page.locator('.satellite')).toHaveCount(0)
})
