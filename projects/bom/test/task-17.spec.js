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

import { test, devices, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('network default', async ({ page }) => {
  await expect(page.locator('.network')).toHaveClass(/online/i)
})

test('network online', async ({ page }) => {
  page.context().setOffline(true)
  await page.waitForTimeout(10)
  await expect(page.locator('.network')).not.toHaveClass(/online/i)
})

test('network offline', async ({ page }) => {
  page.context().setOffline(true)
  await page.waitForTimeout(10)
  await expect(page.locator('.network')).not.toHaveClass(/online/i)
  page.context().setOffline(false)
  await page.waitForTimeout(10)
  await expect(page.locator('.network')).toHaveClass(/online/i)
})
