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
import { data, getUnionRect } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('LineChart | areas', async ({ page }) => {
  await expect(page.locator('#area .areas')).toHaveCount(1)
  await expect(page.locator('#area .areas .area')).toHaveCount(3)
  await expect(page.locator('#area .areas .area-0')).toBeVisible()
  await expect(page.locator('#area .areas .area-1')).toBeVisible()
  await expect(page.locator('#area .areas .area-2')).toBeVisible()

  await expect(page.locator('#line .areas')).toHaveCount(0)
})

test('LineChart | areas color', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const line = page.locator(`#area .dataset-${i}`)
    const lineStyle = await getComputedStyleByLocator(line)
    const area = page.locator(`#area .areas .area-${i}`)
    const style = await getComputedStyleByLocator(area)
    await expect(style.fill).toBe(lineStyle.stroke)
    await expect(parseFloat(style.opacity)).toBeLessThan(1)
  }
})

test('LineChart | areas layout', async ({ page }) => {
  const areasRect = await getOffsetByLocator(page.locator(`#area .areas`))
  const datasetsRect = await getOffsetByLocator(page.locator(`#area .datasets`))

  await expectTolerance(areasRect.centerX, datasetsRect.centerX, 5)
  await expectTolerance(areasRect.centerY, datasetsRect.centerY, 10)
})

test('LineChart | area layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const areaRect = await getOffsetByLocator(page.locator(`#area .area-${i}`))
    const lineRect = await getOffsetByLocator(page.locator(`#area .dataset-${i}`))
    await expectTolerance(areaRect.centerX, lineRect.centerX, 1)
    await expect(areaRect.centerY).toBeGreaterThanOrEqual(lineRect.centerY)
  }
})
