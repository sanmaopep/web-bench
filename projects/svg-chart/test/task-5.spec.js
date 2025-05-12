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

test('LineChart | axes-x labels', async ({ page }) => {
  await expect(page.locator('#lineAxes .axes-x')).toBeAttached()
  await expect(page.locator('#lineAxes .axes-x .label')).toHaveCount(5)
  let i = 0
  for await (const labelText of data.labels) {
    const label = page.locator(`#lineAxes .axes-x .label-${i}`)
    await expect(label).toHaveText(labelText)
    const style = await getComputedStyleByLocator(label)
    await expect(style.fill).not.toBe('none')
    i++
  }
})

test('LineChart | axes-x labels layout', async ({ page }) => {
  const offset0 = await getOffsetByLocator(page.locator(`#lineAxes .axes-x .label-0`))
  const offset4 = await getOffsetByLocator(page.locator(`#lineAxes .axes-x .label-4`))

  await expect(offset0.centerX < offset4.centerX).toBeTruthy()
})

test('LineChart | axes-y labels', async ({ page }) => {
  await expect(page.locator('#lineAxes .axes-y')).toBeAttached()
  await expect(page.locator('#lineAxes .axes-y .label')).toHaveCount(6)
  const values = data.datasets.flatMap((d) => d.data)
  const y0 = parseFloat((await page.locator('#lineAxes .axes-y .label-0').textContent()) ?? '0')
  await expect(y0).toBeCloseTo(Math.min(...values))
  const y5 = parseFloat((await page.locator('#lineAxes .axes-y .label-5').textContent()) ?? '0')
  await expect(y5).toBeCloseTo(Math.max(...values))
  const style = await getComputedStyleByLocator(page.locator('#lineAxes .axes-y .label-5'))
  await expect(style.fill).not.toBe('none')
})

test('LineChart | axes-y labels layout', async ({ page }) => {
  const offset0 = await getOffsetByLocator(page.locator(`#lineAxes .axes-y .label-0`))
  const offset5 = await getOffsetByLocator(page.locator(`#lineAxes .axes-y .label-5`))

  await expect(offset0.centerY > offset5.centerY).toBeTruthy()
})


test('LineChart | axes & datasets layout', async ({ page }) => {
  const datasetsRect = await getOffsetByLocator(page.locator('#lineAxes .datasets'))
  const axesXRect = await getOffsetByLocator(page.locator('#lineAxes .axes-x'))
  const axesYRect = await getOffsetByLocator(page.locator('#lineAxes .axes-y'))
  const svgRect = await getOffsetByLocator(page.locator('#lineAxes'))
  const unionRect = getUnionRect([datasetsRect, axesXRect, axesYRect])
  // console.log({ datasetsRect, svgRect })

  await expectTolerance(unionRect.width, svgRect.width, 15)
  await expectTolerance(unionRect.height, svgRect.height, 15)
})