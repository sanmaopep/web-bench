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
import { getBoxByLocator, getContentBoxByLocator, getMarginBoxByLocator, isExisted } from '@web-bench/test-util'
import path from 'node:path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.toolbar', async ({ page }) => {
  await expect(page.locator('.topbar .toolbar')).toBeAttached()
})

test('.address', async ({ page }) => {
  await expect(page.locator('.topbar select.address')).toBeAttached()
})

test('.setting', async ({ page }) => {
  await expect(page.locator('.topbar .setting')).toBeAttached()
})

// test('elements together fill .topbar', async ({ page }) => {
//   const topbar = await getContentBoxByLocator(page.locator('.topbar'))
//   const toolbar = await getMarginBoxByLocator(page.locator('.toolbar'))
//   const address = await getMarginBoxByLocator(page.locator('.address'))
//   const setting = await getMarginBoxByLocator(page.locator('.setting'))
//   // await expect(toolbar.height).toBeCloseTo(topbar.height) // maybe empty
//   // await expect(address.height).toBeCloseTo(topbar.height)
//   // await expect(setting.height).toBeCloseTo(topbar.height)
//   await expect(toolbar.width + address.width + setting.width).toBeLessThanOrEqual(topbar.width)
// })
