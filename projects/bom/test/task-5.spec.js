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
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util';

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.toolbar buttons', async ({ page }) => {
  await expect(page.locator('.toolbar .back')).toHaveAttribute('disabled')
  await expect(page.locator('.toolbar .forward')).toHaveAttribute('disabled')
  await expect(page.locator('.toolbar .homepage')).not.toHaveAttribute('disabled')
  await expect(page.locator('.toolbar .refresh')).not.toHaveAttribute('disabled')
})

test('.back', async ({ page }) => {
  const contentFrame = page.frame('content')
  
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)
  await expect(page.locator('.back')).not.toHaveAttribute('disabled')

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.back')).toHaveAttribute('disabled')
})

test('.back by iframe page change', async ({ page }) => {
  const contentFrame = page.frame('content')

  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.back')).toHaveAttribute('disabled')

  await contentFrame?.getByText(/javascript/i).click()
  await contentFrame?.waitForURL(/javascript/i)
  await expect(page.locator('.back')).not.toHaveAttribute('disabled')
})

test('.forward', async ({ page }) => {
  const contentFrame = page.frame('content')
  
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)
  await expect(page.locator('.forward')).toHaveAttribute('disabled')

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.forward')).not.toHaveAttribute('disabled')

  await page.locator('.forward').click()
  await contentFrame?.waitForURL(/nodejs/i)
  await expect(page.locator('.forward')).toHaveAttribute('disabled')
})

test('.forward by iframe page change', async ({ page }) => {
  const contentFrame = page.frame('content')

  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.forward')).toHaveAttribute('disabled')

  await contentFrame?.getByText(/javascript/i).click()
  await contentFrame?.waitForURL(/javascript/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.forward')).not.toHaveAttribute('disabled')
})

test('combo actions', async ({ page }) => {
  const contentFrame = page.frame('content')

  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.address').selectOption({ index: 2 })
  await contentFrame?.waitForURL(/css/i)

  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/css/i)

  await page.locator('.forward').click()
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.refresh').click()
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/css/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)

  await expect(page.locator('.back')).toHaveAttribute('disabled')
})
