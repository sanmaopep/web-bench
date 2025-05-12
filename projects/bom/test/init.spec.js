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
import { getMarginBoxByLocator, getViewport, isExisted } from '@web-bench/test-util'
import path from 'node:path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('initial files', async ({ page }) => {
  await expect(isExisted('index.js', path.join(import.meta.dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.css', path.join(import.meta.dirname, '../src'))).toBeTruthy()
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('.browser', async ({ page }) => {
  await expect(page.locator('.browser')).toBeAttached()
  const viewport = await getViewport(page)
  const browser = await getMarginBoxByLocator(page.locator('.browser'))
  await expect(browser.width).toBeCloseTo(viewport.width)
  await expect(browser.height).toBeCloseTo(viewport.height)
})
