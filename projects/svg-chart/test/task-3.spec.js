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
import { configs, data, getUnionRect, hasUniqueValues } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('LineChart | polylines', async ({ page }) => {
  await expect(page.locator('#line polyline.dataset')).toHaveCount(3)
  await expect(page.locator('#line .dataset-0')).toBeVisible()
  await expect(page.locator('#line .dataset-1')).toBeVisible()
  await expect(page.locator('#line .dataset-2')).toBeVisible()
})

test('LineChart | datasets layout', async ({ page }) => {
  const lines = await page.locator('#line polyline.dataset').all()
  const rects = []
  for await (const line of lines) {
    const rect = await getOffsetByLocator(line)
    rects.push(rect)
  }

  const linesRect = getUnionRect(rects)
  const svgRect = await getOffsetByLocator(page.locator('#line'))
  // console.log({ linesRect, svgRect })

  await expectTolerance(linesRect.width, svgRect.width, 10)
  await expectTolerance(linesRect.height, svgRect.height, 10)
})

test('LineChart | datasets layout 2', async ({ page }) => {
  const datasetsRect = await getOffsetByLocator(page.locator('#line .datasets'))
  const svgRect = await getOffsetByLocator(page.locator('#line'))
  // console.log({ datasetsRect, svgRect })

  await expectTolerance(datasetsRect.width, svgRect.width, 10)
  await expectTolerance(datasetsRect.height, svgRect.height, 10)
})

test('LineChart | line colors', async ({ page }) => {
  const lines = await page.locator('#line polyline.dataset').all()
  const strokes = []
  for await (const line of lines) {
    const style = await getComputedStyleByLocator(line)
    strokes.push(style.stroke)
  }
  // console.log({ strokes })

  await expect(hasUniqueValues(strokes)).toBeTruthy()
})
