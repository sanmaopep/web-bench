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
import { expectTolerance, getComputedStyleByLocator, getOffsetByLocator } from '@web-bench/test-util'
import { data, getUnionRect } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('LineChart | grids', async ({ page }) => {
  await expect(page.locator('#lineAxesGrids .grids')).toHaveCount(1)
  await expect(page.locator('#lineAxes .grids')).toHaveCount(0)
  await expect(page.locator('#line .grids')).toHaveCount(0)
})

test('LineChart | grid-x', async ({ page }) => {
  await expect(page.locator('#lineAxesGrids .grid.grid-x')).toHaveCount(5)
  await expect(page.locator('#lineAxesGrids .grid-x-0')).toBeAttached()
  await expect(page.locator('#lineAxesGrids .grid-x-4')).toBeAttached()
  let style = await getComputedStyleByLocator(page.locator('#lineAxesGrids .grid-x-4'))
  await expect(style.stroke).not.toBe('none')
})

test('LineChart | grid-x layout', async ({ page }) => {
  const offset0 = await getOffsetByLocator(page.locator(`#lineAxesGrids .grid-x-0`))
  const offset4 = await getOffsetByLocator(page.locator(`#lineAxesGrids .grid-x-4`))

  await expect(offset0.centerX < offset4.centerX).toBeTruthy()
  await expect(offset0.centerY).toBeCloseTo(offset4.centerY)
})

test('LineChart | grid-y', async ({ page }) => {
  await expect(page.locator('#lineAxesGrids .grid.grid-y')).toHaveCount(6)
  await expect(page.locator('#lineAxesGrids .grid-y-0')).toBeAttached()
  await expect(page.locator('#lineAxesGrids .grid-y-5')).toBeAttached()
  let style = await getComputedStyleByLocator(page.locator('#lineAxesGrids .grid-y-5'))
  await expect(style.stroke).not.toBe('none')
})

test('LineChart | grid-y layout', async ({ page }) => {
  const offset0 = await getOffsetByLocator(page.locator(`#lineAxesGrids .grid-y-0`))
  const offset5 = await getOffsetByLocator(page.locator(`#lineAxesGrids .grid-y-5`))

  await expect(offset0.centerY > offset5.centerY).toBeTruthy()
  await expect(offset0.centerX).toBeCloseTo(offset5.centerX)
})
