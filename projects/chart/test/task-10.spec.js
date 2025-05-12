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
  await page.locator('#type').selectOption({ value: 'scatter' })
})

test('ScatterChart | datasets hidden', async ({ page }) => {
  await expect(page.locator('.chart .dataset-0')).toBeHidden()
  await expect(page.locator('.chart .dataset-1')).toBeHidden()
  await expect(page.locator('.chart .dataset-2')).toBeHidden()
})

test('ScatterChart | dataLabels', async ({ page }) => {
  await expect(page.locator('.chart .dataLabels')).toHaveCount(3)
  await expect(page.locator('.chart .dataLabels-0 .dataLabel')).toHaveCount(5)
  await expect(page.locator('.chart .dataLabels-0 .dataLabel-0')).toBeVisible()
  await expect(page.locator('.chart .dataLabels-0 .dataLabel-4')).toBeVisible()

  await expect(page.locator('#line .dataLabels')).toHaveCount(0)
})

test('ScatterChart | points', async ({ page }) => {
  await expect(page.locator('.chart .points')).toHaveCount(3)
  await expect(page.locator('.chart .points-0 circle.point')).toHaveCount(5)
  await expect(page.locator('.chart .points-0 circle.point-0')).toBeVisible()
  await expect(page.locator('.chart .points-0 circle.point-4')).toBeVisible()
})

test('ScatterChart | pointStyle', async ({ page }) => {
  await page.locator('#pointStyle').selectOption({ value: 'rect' })
  await expect(page.locator('.chart .points')).toHaveCount(3)
  await expect(page.locator('.chart .points-0 rect.point')).toHaveCount(5)
  await expect(page.locator('.chart .points-0 rect.point-0')).toBeVisible()
  await expect(page.locator('.chart .points-0 rect.point-4')).toBeVisible()
})

test('ScatterChart | dataLabel checkbox', async ({ page }) => {
  await expect(page.locator('#dataLabels')).toBeDisabled()

  await page.locator('#type').selectOption({ value: 'line' })
  await expect(page.locator('#dataLabels')).not.toBeDisabled()
})

test('ScatterChart | dataLabels & points layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const pointsRect = await getOffsetByLocator(page.locator(`.chart .points-${i}`))
    const dataLabelsRect = await getOffsetByLocator(page.locator(`.chart .dataLabels-${i}`))
    await expectTolerance(pointsRect.centerX, dataLabelsRect.centerX, 10)
    await expectTolerance(pointsRect.centerY, dataLabelsRect.centerY, 10)
  }
})
