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
  await page.locator('#type').selectOption({ value: 'scatter' })
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.scatter')).toBeAttached()
})

test('BarChart | tooltips | init', async ({ page }) => {
  await expect(page.locator('.chart .tooltips')).toHaveCount(1)
  await expect(page.locator('.chart .tooltips')).toBeHidden()
})

test('BarChart | tooltips | show', async ({ page }) => {
  const tooltips = page.locator('.chart .tooltips')
  await page.locator('.chart').hover()
  await expect(tooltips).toBeVisible()
  await expect(page.locator('.chart .grid-x.selected')).toHaveCount(1)
  await expect(page.locator('.chart .grid-x-2.selected')).toHaveCount(1)

  for await (const [, dataset] of Object.entries(data.datasets)) {
    await expect(tooltips).toContainText(`${dataset.data[2]}`)
  }
})

test('BarChart | tooltips | hide', async ({ page }) => {
  const tooltips = page.locator('.chart .tooltips')
  await page.locator('.chart').hover()
  await expect(tooltips).toBeVisible()
  await expect(page.locator('.chart .grid-x.selected')).toHaveCount(1)

  await page.locator('.chart .legends').hover()
  await expect(tooltips).toHaveClass(/hidden/)
  await expect(page.locator('.chart .grid-x.selected')).toHaveCount(0)
})

// test('BarChart | tooltips | show', async ({ page }) => {
//   const tooltips = page.locator('.chart .tooltips')
//   const gridXs = await page.locator('.chart .grid-x').all()
//   for await (const [i, gridX] of Object.entries(gridXs)) {
//     if (parseInt(i) >= gridXs.length - 1) break
//     const offset = await getOffsetByLocator(gridX)
//     await page.mouse.move(offset.centerX, offset.centerY)
//     console.log(offset)

//     // await expect(gridX).toHaveClass(/selected/i)
//     // await expect(tooltips).toBeVisible()

//     for await (const [, dataset] of Object.entries(data.datasets)) {
//       await expect(tooltips).toContainText(`${dataset.data[i]}`)
//     }
//   }
// })

// test('BarChart | tooltips | hide', async ({ page }) => {
//   const tooltips = page.locator('.chart .tooltips')
//   const gridXs = await page.locator('.chart .grid-x').all()
//   const offsetLegends = await getOffsetByLocator(page.locator('.chart .legends'))
//   for await (const [, gridX] of Object.entries(gridXs)) {
//     const offset = await getOffsetByLocator(gridX)
//     await page.mouse.move(offset.centerX, offset.centerY)
//     await expect(tooltips).not.toHaveClass(/hidden/i)
//     await expect(tooltips).toBeVisible()

//     await page.mouse.move(offsetLegends.centerX, offsetLegends.centerY)
//     // await expect(tooltips).not.toBeVisible() WHY failed?
//     await expect(tooltips).toHaveClass(/hidden/i)
//   }
// })

// test('BarChart | tooltips | position', async ({ page }) => {
//   const tooltips = page.locator('.chart .tooltips')
//   const gridXs = await page.locator('.chart .grid-x').all()
//   for await (const [i, gridX] of Object.entries(gridXs)) {
//     const offset = await getOffsetByLocator(gridX)
//     await page.mouse.move(offset.centerX, offset.centerY)

//     const offset1 = await getOffsetByLocator(tooltips)
//     const length1 = length(0, 0, offset1.width, offset1.height)
//     const distance = length(offset.centerX, offset.centerY, offset1.centerX, offset1.centerY)
//     await expect(distance).toBeLessThanOrEqual(length1)
//   }
// })
