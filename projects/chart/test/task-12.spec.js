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
import { data, getUnionRect, TO } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#type').selectOption({ value: 'area' })
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.area')).toBeAttached()
})

test('AreaChart | areas', async ({ page }) => {
  await expect(page.locator('.chart .areas')).toHaveCount(1)
  await expect(page.locator('.chart .areas .area')).toHaveCount(3)
  await expect(page.locator('.chart .areas .area-0')).toBeVisible()
  await expect(page.locator('.chart .areas .area-1')).toBeVisible()
  await expect(page.locator('.chart .areas .area-2')).toBeVisible()

  await page.locator('#type').selectOption({ value: 'line' })
  await expect(page.locator('.chart .areas')).toHaveCount(0)
})

test('AreaChart | areas color', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const lineStyle = await getComputedStyleByLocator(page.locator(`.chart .dataset-${i}`))
    const areaStyle = await getComputedStyleByLocator(page.locator(`.chart .areas .area-${i}`))
    await expect(areaStyle.fill).toBe(lineStyle.stroke)
    await expect(parseFloat(areaStyle.opacity)).toBeLessThan(1)
  }
})

test('AreaChart | areas layout', async ({ page }) => {
  const areasRect = await getOffsetByLocator(page.locator(`.chart .areas`))
  const datasetsRect = await getOffsetByLocator(page.locator(`.chart .datasets`))

  await expectTolerance(areasRect.centerX, datasetsRect.centerX, 5)
  await expectTolerance(areasRect.centerY, datasetsRect.centerY, 10)
})

test('AreaChart | area layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const areaRect = await getOffsetByLocator(page.locator(`.chart .area-${i}`))
    const lineRect = await getOffsetByLocator(page.locator(`.chart .dataset-${i}`))
    await expectTolerance(areaRect.centerX, lineRect.centerX, 1)
    await expect(areaRect.centerY).toBeGreaterThanOrEqual(lineRect.centerY)
  }
})
