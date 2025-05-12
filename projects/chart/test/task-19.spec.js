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
import { data, length, TO } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#type').selectOption({ value: 'pie' })
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.pie')).toBeAttached()
})

test('PieChart | hover sector', async ({ page }) => {
  const tooltips = page.locator('.chart .tooltips')
  const sectors = await page.locator('.chart .sector').all()
  for await (const [i, sector] of Object.entries(sectors)) {
    const offset0 = await getOffsetByLocator(sector)
    await page.mouse.move(offset0.centerX, offset0.centerY, { steps: 10 })

    await page.waitForTimeout(100)
    const offset1 = await getOffsetByLocator(sector)
    await expect(offset1.width).toBeCloseTo(offset0.width * 1.05)
    await expect(offset1.height).toBeCloseTo(offset0.height * 1.05)
  }
})

test('PieChart | tooltips | hide', async ({ page }) => {
  const tooltips = page.locator('.chart .tooltips')
  const sectors = await page.locator('.chart .sector').all()
  const offsetLegends = await getOffsetByLocator(page.locator('.chart .legends'))
  for await (const [, sector] of Object.entries(sectors)) {
    const offset0 = await getOffsetByLocator(sector)
    await page.mouse.move(offset0.centerX, offset0.centerY, { steps: 10 })
    await page.mouse.move(offsetLegends.centerX, offsetLegends.centerY, { steps: 10 })

    await page.waitForTimeout(100)
    const offset1 = await getOffsetByLocator(sector)
    await expect(offset1.width).toBeCloseTo(offset0.width)
    await expect(offset1.height).toBeCloseTo(offset0.height)
  }
})
