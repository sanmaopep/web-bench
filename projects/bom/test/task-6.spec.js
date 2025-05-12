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
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('intro click', async ({ page }) => {
  const contentFrame = page.frame('content')

  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.address')).toHaveValue(/intro/i)

  await contentFrame?.getByText(/javascript/i).click()
  await contentFrame?.waitForURL(/javascript/i)
  // console.log(await page.locator('.address').getAttribute('data-log'))
  await expect(page.locator('.address')).toHaveValue(/javascript/i)
})

test('.back', async ({ page }) => {
  const contentFrame = page.frame('content')

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.address')).toHaveValue(/intro/i)
})

test('.forward', async ({ page }) => {
  const contentFrame = page.frame('content')

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.address')).toHaveValue(/intro/i)

  await page.locator('.forward').click()
  await contentFrame?.waitForURL(/nodejs/i)
  await expect(page.locator('.address')).toHaveValue(/nodejs/i)
})
