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

import { expect, test } from '@playwright/test'
import { getOffsetByLocator } from '@web-bench/test-util'
import { data, getUnionRect, length } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#dataLabels').check()
})

test('LineChart | tooltips | init', async ({ page }) => {
  await expect(page.locator('.chart .tooltips')).toHaveCount(1)
  await expect(page.locator('.chart .tooltips')).toBeHidden()
})

test('LineChart | tooltips | show', async ({ page }) => {
  const tooltips = page.locator('.chart .tooltips')
  const grid2 = await page.locator('.chart .grid-x-2')

  await page.locator('.chart').hover()
  await expect(grid2).toHaveClass(/selected/i)
  await expect(tooltips).not.toHaveClass(/hidden/i)
})

test('LineChart | tooltips | hide', async ({ page }) => {
  const tooltips = page.locator('.chart .tooltips')
  const grid2 = await page.locator('.chart .grid-x-2')

  await page.locator('.chart').hover()
  await expect(grid2).toHaveClass(/selected/i)
  await expect(tooltips).not.toHaveClass(/hidden/i)

  await page.locator('.chart .legend-0 circle').hover()
  await expect(grid2).not.toHaveClass(/selected/i)
  await expect(tooltips).toHaveClass(/hidden/i)
})

test('LineChart | tooltips | position', async ({ page }) => {
  const tooltips = page.locator('.chart .tooltips')
  await page.locator('.chart').hover()
  await expect(tooltips).not.toHaveClass(/hidden/i)

  const offset = await getOffsetByLocator(page.locator('.chart'))
  const offset1 = await getOffsetByLocator(tooltips)
  const length1 = length(0, 0, offset1.width, offset1.height)
  const distance = length(offset.centerX, offset.centerY, offset1.centerX, offset1.centerY)
  await expect(distance).toBeLessThanOrEqual(length1)
})

test('LineChart | tooltips | content', async ({ page }) => {
  await page.locator('.chart').hover()
  const bg = await getOffsetByLocator(page.locator('.chart .tooltips .bg'))
  const texts = await Promise.all(
    (await page.locator('.chart .tooltips text').all()).map(async (t) => getOffsetByLocator(t))
  )
  const rect = getUnionRect(texts)

  await expect(rect.left >= bg.left).toBeTruthy()
  await expect(rect.top >= bg.top).toBeTruthy()
  await expect(rect.right <= bg.right).toBeTruthy()
  await expect(rect.bottom <= bg.bottom).toBeTruthy()
})
