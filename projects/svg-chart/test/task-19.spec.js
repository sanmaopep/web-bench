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
import { getUnionRect, hasUniqueValues } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('PieChart | pies', async ({ page }) => {
  await expect(page.locator('#pie g.dataset')).toHaveCount(1)
  await expect(page.locator('#pie .dataset-0')).toBeVisible()
  await expect(page.locator('#pie .dataset-0 path.sector')).toHaveCount(5)

  await expect(page.locator('#pie .grids')).toBeHidden()
  await expect(page.locator('#pie .axes')).toBeHidden()
})

test('PieChart | sector colors', async ({ page }) => {
  const sectors = await page.locator(`#pie .dataset-0 .sector`).all()
  const fills = []
  for await (const sector of sectors) {
    const style = await getComputedStyleByLocator(sector)
    fills.push(style.fill)
  }

  await expect(hasUniqueValues(fills)).toBeTruthy()
})

test('PieChart | sector layout', async ({ page }) => {
  const sectors = await page.locator(`#pie .dataset-0 .sector`).all()
  const offsets = []
  for await (const sector of sectors) {
    const offset = await getOffsetByLocator(sector)
    offsets.push(offset)
  }

  const rect = getUnionRect(offsets)

  // await expect(rect.width).toBeCloseTo(rect.height)
  expectTolerance(rect.width, rect.height, 5)
})
