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
})

test('.back menu items', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu .menu-item')).toHaveCount(2)
  await expect(page.locator('.back-menu .menu-item').nth(0)).toContainText(/intro/i)
  await expect(page.locator('.back-menu .menu-item').nth(1)).toContainText(/html/i)
})

test('.back menu item click', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu .menu-item').nth(0)).toContainText(/intro/i)
  await page.locator('.back-menu .menu-item').nth(0).click()
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu .menu-item')).toHaveCount(3)
  await expect(page.locator('.back-menu .menu-item').nth(0)).toContainText(/intro/i)
  await expect(page.locator('.back-menu .menu-item').nth(1)).toContainText(/html/i)
  await expect(page.locator('.back-menu .menu-item').nth(2)).toContainText(/nodejs/i)
})

test('.back & menu', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu .menu-item')).toHaveCount(1)
  await expect(page.locator('.back-menu .menu-item').nth(0)).toContainText(/intro/i)
})
