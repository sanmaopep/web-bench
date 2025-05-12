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

import { test, expect } from '@playwright/test'
import {
  isExisted,
  getViewport,
  getOffsetByLocator,
  expectTolerance,
  getComputedStyleByLocator,
  expectBetween,
} from '@web-bench/test-util'
import {
  configs,
  data,
  density,
  getUnionRect,
  hasSameValue,
  hasUniqueValues,
  isAscending,
  TO,
} from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#type').selectOption({ value: 'bar' })
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.bar')).toBeAttached()
})

test('BarChart | bars', async ({ page }) => {
  await expect(page.locator('.chart g.dataset')).toHaveCount(3)
  await expect(page.locator('.chart .dataset-0')).toBeVisible()
  await expect(page.locator('.chart .dataset-1')).toBeVisible()
  await expect(page.locator('.chart .dataset-2')).toBeVisible()
})

test('BarChart | grids', async ({ page }) => {
  await expect(page.locator('.chart .grids')).toBeAttached()
  await expect(page.locator('.chart .grids .grid-x')).toHaveCount(6)
  await expect(page.locator('.chart .grids .grid-x-0')).toBeAttached()

  const offset0 = await getOffsetByLocator(page.locator('.chart .grid-x-0'))
  const offset1 = await getOffsetByLocator(page.locator('.chart .grid-x-1'))
  const offset2 = await getOffsetByLocator(page.locator('.chart .axis-x'))
  await expectTolerance((offset1.left - offset0.left) / density, offset2.width / density / 5, 5)
})

test('BarChart | layout', async ({ page }) => {
  const legendsRect = await getOffsetByLocator(page.locator('.chart .legends'))
  const datasetsRect = await getOffsetByLocator(page.locator('.chart .datasets'))
  const axesXRect = await getOffsetByLocator(page.locator('.chart .axes-x'))
  const axesYRect = await getOffsetByLocator(page.locator('.chart .axes-y'))
  const svgRect = await getOffsetByLocator(page.locator('.chart'))
  const unionRect = getUnionRect([legendsRect, datasetsRect, axesXRect, axesYRect])

  await expectTolerance(unionRect.width, svgRect.width, 20)
  await expectTolerance(unionRect.height, svgRect.height, 20)
})

test('BarChart | bar colors in a dataset', async ({ page }) => {
  for (let i = 0; i < data.datasets.length; i++) {
    const bars = await page.locator(`.chart .dataset-${i} .bar`).all()
    const fills = []
    for await (const bar of bars) {
      const style = await getComputedStyleByLocator(bar)
      fills.push(style.fill)
    }

    await expect(hasSameValue(fills)).toBeTruthy()
  }
})

test('BarChart | bar colors between datasets', async ({ page }) => {
  const bars = await page.locator('.chart .dataset .bar-0').all()
  const fills = []
  for await (const bar of bars) {
    const style = await getComputedStyleByLocator(bar)
    fills.push(style.fill)
  }

  await expect(hasUniqueValues(fills)).toBeTruthy()
})

test('BarChart | bars layout in a dataset', async ({ page }) => {
  for (let i = 0; i < data.datasets.length; i++) {
    const bars = await page.locator(`.chart .dataset-${i} .bar`).all()
    const xs = []
    for await (const bar of bars) {
      const offset = await getOffsetByLocator(bar)
      xs.push(offset.centerX)
    }

    await expect(isAscending(xs)).toBeTruthy()
  }
})

test('BarChart | bars layout in a column', async ({ page }) => {
  const bars = await page.locator('.chart .dataset .bar-0').all()
  const xs = []
  for await (const bar of bars) {
    const offset = await getOffsetByLocator(bar)
    xs.push(offset.centerX)
  }

  await expect(isAscending(xs)).toBeTruthy()
})

test('BarChart | axis-x labels', async ({ page }) => {
  const labels = await page.locator('.chart .axes-x .label').all()
  for await (const [i, label] of Object.entries(labels)) {
    const offset = await getOffsetByLocator(label)
    const gridI0 = await getOffsetByLocator(page.locator(`.chart .grids .grid-x-${parseInt(i)}`))
    const gridI1 = await getOffsetByLocator(
      page.locator(`.chart .grids .grid-x-${parseInt(i) + 1}`)
    )

    await expectBetween(offset.centerX, gridI0.centerX, gridI1.centerX)
  }
})
