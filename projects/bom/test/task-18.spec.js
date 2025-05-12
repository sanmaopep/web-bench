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

// test.beforeEach(async ({ page }) => {
//   await page.goto('/index.html')
// })

test('geolocation default', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  await page.goto('/index.html');

  await expect(page.locator('.geolocation')).not.toHaveClass(/reached/i)
})

test('geolocation reached', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  await page.goto('/index.html');

  await context.setGeolocation({ latitude: 30, longitude: 120 })
  await page.waitForTimeout(10)
  await expect(page.locator('.geolocation')).toHaveClass(/reached/i)
})

test('geolocation not reached', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  await page.goto('/index.html');

  await context.setGeolocation({ latitude: 30, longitude: 120 })
  await page.waitForTimeout(10)
  await expect(page.locator('.geolocation')).toHaveClass(/reached/i)

  // clear watch after reaching
  await context.setGeolocation({ latitude: 0, longitude: 0 })
  await page.waitForTimeout(10)
  await expect(page.locator('.geolocation')).toHaveClass(/reached/i)
})
