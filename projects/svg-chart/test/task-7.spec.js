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

test('LineChart | legends', async ({ page }) => {
  await expect(page.locator('#lineAxesGridsLegends .legends')).toHaveCount(1)
  await expect(page.locator('#lineAxesGrids .legends')).toHaveCount(0)
  await expect(page.locator('#lineAxes .legends')).toHaveCount(0)
  await expect(page.locator('#line .legends')).toHaveCount(0)
})

test('LineChart | legend', async ({ page }) => {
  await expect(page.locator('#lineAxesGridsLegends .legend')).toHaveCount(3)
  await expect(page.locator('#lineAxesGridsLegends .legend-0')).toBeAttached()
  await expect(page.locator('#lineAxesGridsLegends .legend-1')).toBeAttached()
  await expect(page.locator('#lineAxesGridsLegends .legend-2')).toBeAttached()
})

test('LineChart | legend content', async ({ page }) => {
  const dot = page.locator('#lineAxesGridsLegends .legend-0 circle')
  const style = await getComputedStyleByLocator(page.locator('#lineAxesGridsLegends .dataset-0'))

  await expect(dot).toBeAttached()
  await expect(dot).toHaveCSS('fill', style.stroke)
  await expect(page.locator('#lineAxesGridsLegends .legend-0 text')).toHaveText(
    data.datasets[0].label
  )
})

test('LineChart | legends & axes & datasets layout', async ({ page }) => {
  const legendsRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends .legends'))
  const datasetsRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends .datasets'))
  const axesXRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends .axes-x'))
  const axesYRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends .axes-y'))
  const svgRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends'))
  const unionRect = getUnionRect([legendsRect, datasetsRect, axesXRect, axesYRect])
  // console.log({ datasetsRect, svgRect })

  await expectTolerance(unionRect.width, svgRect.width, 15)
  await expectTolerance(unionRect.height, svgRect.height, 15)
})