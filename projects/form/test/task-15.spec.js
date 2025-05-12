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

const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/Survey.js', async ({ page }) => {
  await expect(isExisted('common/Survey.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('survey structure', async ({ page }) => {
  const qcount = await page.locator('form .q').count()
  await expect(qcount).toBeGreaterThanOrEqual(10)
  const count = await page.locator('.contents .contents-item').count()
  await expect(count).toBeGreaterThanOrEqual(10)
})
