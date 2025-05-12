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
  await page.locator('#dataLabels').check()
  await page.locator('#pointStyle').selectOption({ index: 1 })
})

test('LineChart | click legend to hide', async ({ page }) => {
  await expect(page.locator('.chart .dataset-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).not.toHaveClass(/hidden/)

  await page.locator('.chart .legend-0 circle').click()
  await expect(page.locator('.chart .dataset-0')).toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).toHaveClass(/hidden/)
})

test('LineChart | click legend to show', async ({ page }) => {
  await expect(page.locator('.chart .dataset-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).not.toHaveClass(/hidden/)

  await page.locator('.chart .legend-0 circle').click()
  await expect(page.locator('.chart .dataset-0')).toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).toHaveClass(/hidden/)

  await page.locator('.chart .legend-0 circle').click()
  await expect(page.locator('.chart .dataset-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).not.toHaveClass(/hidden/)
})
