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

test('.back menu', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()

  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()
})

test('.forward menu', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.forward').click({ button: 'right' })
  await expect(page.locator('.forward-menu')).toBeVisible()

  await contentFrame?.locator('body').click()
  await expect(page.locator('.forward-menu')).not.toBeVisible()
})

test('all doc pages', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 1 })
  await contentFrame?.waitForURL(/javascript/i)
  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()
  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()

  await page.locator('.address').selectOption({ index: 2 })
  await contentFrame?.waitForURL(/css/i)
  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()
  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()

  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()
  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)
  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()
  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()
})
