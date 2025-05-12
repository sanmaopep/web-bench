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
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { data, getUnionRect, hasUniqueValues } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#pointStyle').selectOption({ index: 1 })
})

test('LineChart | uncheck #pointStyle', async ({ page }) => {
  await page.locator('#pointStyle').selectOption({ index: 0 })
  await expect(page.locator('.chart .points')).not.toBeAttached()
})

test('LineChart | check #pointStyle', async ({ page }) => {
  await expect(page.locator('.chart .points')).toHaveCount(3)
})

test('LineChart | points', async ({ page }) => {
  await expect(page.locator('.chart .points')).toHaveCount(3)
  await expect(page.locator('.chart .points-0 circle.point')).toHaveCount(5)
  await expect(page.locator('.chart .points-0 circle.point-0')).toBeVisible()
  await expect(page.locator('.chart .points-0 circle.point-4')).toBeVisible()

  await expect(page.locator('#line .points')).toHaveCount(0)
})

test('LineChart | points | rect', async ({ page }) => {
  await page.locator('#pointStyle').selectOption({ index: 2 })
  await expect(page.locator('.chart .points')).toHaveCount(3)
  await expect(page.locator('.chart .points-0 rect.point')).toHaveCount(5)
  await expect(page.locator('.chart .points-0 rect.point-0')).toBeVisible()
  await expect(page.locator('.chart .points-0 rect.point-4')).toBeVisible()
})

test('LineChart | points color', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const line = page.locator(`.chart .dataset-${i}`)
    const lineStyle = await getComputedStyleByLocator(line)
    for await (const [j, item] of Object.entries(dataset.data)) {
      const point = page.locator(`.chart .points-${i} .point-${j}`)
      await expect(point).toHaveCSS('fill', lineStyle.stroke)
    }
  }
})

test('LineChart | points layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const pointsRect = await getOffsetByLocator(page.locator(`.chart .points-${i}`))
    const lineRect = await getOffsetByLocator(page.locator(`.chart .dataset-${i}`))
    await expectTolerance(pointsRect.centerX, lineRect.centerX, 10)
    await expectTolerance(pointsRect.centerY, lineRect.centerY, 10)
  }
})
