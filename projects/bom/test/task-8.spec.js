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

/**
 * @see https://github.com/microsoft/playwright/issues/14431
 */
test('Check beforeunload dialog 1', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    // console.log('check 1', dialog.type(), dialog.message())
    // assert(dialog.type() === 'beforeunload')
    await dialog.dismiss()
  })

  await page.evaluate(() => window.location.reload())
  let url = await page.evaluate(() => localStorage.url)
  // console.log(url)
  await expect(url.toLowerCase().includes('intro')).toBeTruthy()
})

test('Check beforeunload dialog 2', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    // console.log('check 2', dialog.type(), dialog.message())
    await dialog.dismiss()
  })

  await page.evaluate(() => window.location.reload())
  let url = await page.evaluate(() => localStorage.url)
  await expect(url.toLowerCase().includes('intro')).toBeTruthy()

  await page.locator('.address').selectOption({ index: 3 })
  await page.frame('content')?.waitForURL(/html/i)
  await page.evaluate(() => window.location.reload())

  url = await page.evaluate(() => localStorage.url)
  // console.log(url)
  await expect(url.toLowerCase().includes('html')).toBeTruthy()
  await page.frame('content')?.waitForURL(/html/i)
})
