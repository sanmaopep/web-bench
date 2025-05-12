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
import { data, doRectanglesIntersect, getUnionRect } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('PieChart | dataLabels', async ({ page }) => {
  await expect(page.locator('#pie .dataLabels')).toHaveCount(1)
  await expect(page.locator('#pie .dataLabels-0 .dataLabel')).toHaveCount(5)
  await expect(page.locator('#pie .dataLabels-0 .dataLabel-0')).toBeVisible()
  await expect(page.locator('#pie .dataLabels-0 .dataLabel-4')).toBeVisible()
})

test('PieChart | dataLabels color', async ({ page }) => {
  for await (const [j, item] of Object.entries(data.datasets[0].data)) {
    // const sector = await getComputedStyleByLocator(page.locator(`#pie .dataset-0 .sector-${j}`))
    const dataLabel = page.locator(`#pie .dataLabels-0 .dataLabel-${j}`)
    await expect(dataLabel).toContainText(`${item}`)
  }
})

test('PieChart | connect lines', async ({ page }) => {
  await expect(page.locator('#pie .connect')).toHaveCount(5)

  for await (const [j, item] of Object.entries(data.datasets[0].data)) {
    const offset0 = await getOffsetByLocator(page.locator(`#pie .connect-${j}`))
    const offset1 = await getOffsetByLocator(page.locator(`#pie .dataLabel-${j}`))
    const offset2 = await getOffsetByLocator(page.locator(`#pie .sector-${j}`))

    await expect(doRectanglesIntersect(offset0, offset1)).toBeTruthy()
    await expect(doRectanglesIntersect(offset0, offset2)).toBeTruthy()
  }
})

// test('PieChart | dataLabels layout', async ({ page }) => {
//   for await (const [i, dataset] of Object.entries(data.datasets)) {
//     const dataLabelsRect = await getOffsetByLocator(page.locator(`#pie .dataLabels-${i}`))
//     const piesRect = await getOffsetByLocator(page.locator(`#pie .dataset-${i}`))
//     await expectTolerance(dataLabelsRect.centerX, piesRect.centerX, 10)
//     await expectTolerance(dataLabelsRect.top, piesRect.top, 20)
//   }
// })
