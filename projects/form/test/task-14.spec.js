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

test('multi1 change required', async ({ page }) => {
  await expect(page.locator('input[type="checkbox"][name="multi1"]:optional')).toHaveCount(3)
  await expect(page.locator('input[type="checkbox"][name="multi1"]:required')).toHaveCount(0)

  await page.locator('#multi1 .q-required').check()
  await expect(page.locator('input[type="checkbox"][name="multi1"]:optional')).toHaveCount(3)
  await expect(page.locator('input[type="checkbox"][name="multi1"]:required')).toHaveCount(0)
})

test('multi1 validate', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.getAll('multi1')).toEqual(['0'])
  })

  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'alert') {
      await dialog.accept()
    }
  })

  await page.locator('#multi1 .q-required').check()
  await submit(page)
  await expect(page.locator('input[type="checkbox"][name="multi1"]:invalid')).toHaveCount(0)

  await page.locator('input[type="checkbox"][name="multi1"]').first().check()
  await submit(page)
})
