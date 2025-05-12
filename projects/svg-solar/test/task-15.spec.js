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

test('tails | path or polyline', async ({ page }) => {
  const c1 = await page.locator('path.tail').count()
  const c2 = await page.locator('polyline.tail').count()
  await expect(c1 + c2).toBe(8)
})

test('tails | star-planets ', async ({ page }) => {
  await expect(page.locator('.tail')).toHaveCount(8)
  const tail = page.locator('.tail').nth(2)
  await expect(tail).toBeVisible()
})

test('tails | planet-satellites ', async ({ page }) => {
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  await expect(page.locator('.tail')).toHaveCount(5)
  const tail = page.locator('.tail').nth(2)
  await expect(tail).toBeVisible()
})
