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
} from '@web-bench/test-util'
import { configs, data, getUnionRect, hasUniqueValues, TO } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#type').selectOption({ value: 'step' })
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.step')).toBeAttached()
})

test('StepChart | polylines', async ({ page }) => {
  await expect(page.locator('.chart polyline.dataset')).toHaveCount(3)
  await expect(page.locator('.chart .dataset-0')).toBeVisible()
  await expect(page.locator('.chart .dataset-1')).toBeVisible()
  await expect(page.locator('.chart .dataset-2')).toBeVisible()
})

test('StepChart | layout', async ({ page }) => {
  const legendsRect = await getOffsetByLocator(page.locator('.chart .legends'))
  const datasetsRect = await getOffsetByLocator(page.locator('.chart .datasets'))
  const axesXRect = await getOffsetByLocator(page.locator('.chart .axes-x'))
  const axesYRect = await getOffsetByLocator(page.locator('.chart .axes-y'))
  const svgRect = await getOffsetByLocator(page.locator('.chart'))
  const unionRect = getUnionRect([legendsRect, datasetsRect, axesXRect, axesYRect])

  // console.log({ legendsRect, datasetsRect, axesXRect, axesYRect })
  // console.log({ unionRect, svgRect })
  await expectTolerance(unionRect.width, svgRect.width, 20)
  await expectTolerance(unionRect.height, svgRect.height, 20)
})

// TODO check step y values

test('StepChart | line colors', async ({ page }) => {
  const lines = await page.locator('.chart polyline.dataset').all()
  const strokes = []
  for await (const line of lines) {
    const style = await getComputedStyleByLocator(line)
    strokes.push(style.stroke)
  }
  // console.log({ strokes })

  await expect(hasUniqueValues(strokes)).toBeTruthy()
})
