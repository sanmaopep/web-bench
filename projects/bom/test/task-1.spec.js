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

test('.topbar', async ({ page }) => {
  await expect(page.locator('.browser .topbar')).toBeAttached()
})

test('.content', async ({ page }) => {
  await expect(page.locator('.browser iframe.content[name="content"]')).toBeAttached()
})

test('.topbar .content together fill .browser', async ({ page }) => {
  const browser = await getContentBoxByLocator(page.locator('.browser'))
  const topbar = await getMarginBoxByLocator(page.locator('.topbar'))
  const content = await getMarginBoxByLocator(page.locator('.content'))
  await expect(topbar.width).toBeCloseTo(browser.width)
  await expect(content.width).toBeCloseTo(browser.width)
  await expect(topbar.height + content.height).toBeCloseTo(browser.height)
})
