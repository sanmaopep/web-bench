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

test('LineChart | axes, axes-x, axes-y', async ({ page }) => {
  await expect(page.locator('#lineAxes .axes')).toHaveCount(2)
  await expect(page.locator('#line .axes')).toHaveCount(0)
})

test('LineChart | axis-x & axis-y', async ({ page }) => {
  await expect(page.locator('#lineAxes .axes.axes-x .axis-x')).toHaveCount(1)
  await expect(page.locator('#lineAxes .axis-x')).toBeAttached()
  let style = await getComputedStyleByLocator(page.locator('#lineAxes .axis-x'))
  await expect(style.stroke).not.toBe('none')
  // console.log(style.stroke)

  await expect(page.locator('#lineAxes .axes.axes-y .axis-y')).toHaveCount(1)
  style = await getComputedStyleByLocator(page.locator('#lineAxes .axis-y'))
  await expect(style.stroke).not.toBe('none')

  await expect(page.locator('#line .axes.axes-x')).toHaveCount(0)
  await expect(page.locator('#line .axes.axes-y')).toHaveCount(0)
})
