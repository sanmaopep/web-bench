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

test('common/DataQuestion.js', async ({ page }) => {
  await expect(isExisted('common/DataQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('form structure', async ({ page }) => {
  const qcount = await page.locator('form .q').count()
  await expect(qcount).toBeGreaterThanOrEqual(15)
  const count = await page.locator('.contents .contents-item').count()
  await expect(count).toBeGreaterThanOrEqual(15)
})

test('data-url change required', async ({ page }) => {
  await expect(page.locator('input[name="data-url"]:required')).toHaveCount(0)
  await page.locator('#data-url .q-required').check()
  await expect(page.locator('input[name="data-url"]:required')).toHaveCount(1)
})

test('data-url validate', async ({ page }) => {
  const content = 'http://test.com'
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('data-url')).toEqual(content)
  })

  await page.locator('#data-url .q-required').check()
  await submit(page)
  await expect(page.locator('input[name="data-url"]:invalid')).toHaveCount(1)

  await page.locator('input[name="data-url"]').fill('test.com')
  await submit(page)
  await expect(page.locator('input[name="data-url"]:invalid')).toHaveCount(1)

  await page.locator('input[name="data-url"]').fill(content)
  await submit(page)
  await expect(page.locator('input[name="data-url"]:invalid')).toHaveCount(0)
})

test('data-tel change required', async ({ page }) => {
  await expect(page.locator('input[name="data-tel"]:required')).toHaveCount(0)
  await page.locator('#data-tel .q-required').check()
  await expect(page.locator('input[name="data-tel"]:required')).toHaveCount(1)
})

test('data-tel validate', async ({ page }) => {
  const content = '12345678901'
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('data-tel')).toEqual(content)
  })

  await page.locator('#data-tel .q-required').check()
  await submit(page)
  await expect(page.locator('input[name="data-tel"]:invalid')).toHaveCount(1)

  // await page.locator('input[name="data-tel"]').fill('abc')
  // await submit(page)
  // await expect(page.locator('input[name="data-tel"]:invalid')).toHaveCount(1)

  await page.locator('input[name="data-tel"]').fill(content)
  await submit(page)
  await expect(page.locator('input[name="data-tel"]:invalid')).toHaveCount(0)
})

test('data-email change required', async ({ page }) => {
  await expect(page.locator('input[name="data-email"]:required')).toHaveCount(0)
  await page.locator('#data-email .q-required').check()
  await expect(page.locator('input[name="data-email"]:required')).toHaveCount(1)
})

test('data-email validate', async ({ page }) => {
  const content = 'abc@test.com'
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('data-email')).toEqual(content)
  })

  await page.locator('#data-email .q-required').check()
  await submit(page)
  await expect(page.locator('input[name="data-email"]:invalid')).toHaveCount(1)

  await page.locator('input[name="data-email"]').fill('test.com')
  await submit(page)
  await expect(page.locator('input[name="data-email"]:invalid')).toHaveCount(1)

  await page.locator('input[name="data-email"]').fill(content)
  await submit(page)
  await expect(page.locator('input[name="data-email"]:invalid')).toHaveCount(0)
})

test('data-date change required', async ({ page }) => {
  await expect(page.locator('input[name="data-date"]:required')).toHaveCount(0)
  await page.locator('#data-date .q-required').check()
  await expect(page.locator('input[name="data-date"]:required')).toHaveCount(1)
})

test('data-date validate', async ({ page }) => {
  const content = '2024-12-12'
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('data-date')).toEqual(content)
  })

  await page.locator('#data-date .q-required').check()
  await submit(page)
  await expect(page.locator('input[name="data-date"]:invalid')).toHaveCount(1)

  await expect(page.locator('input[name="data-date"]').fill('test.com')).rejects.toThrow(
    /malformed/i
  )
  await submit(page)
  await expect(page.locator('input[name="data-date"]:invalid')).toHaveCount(1)

  await page.locator('input[name="data-date"]').fill(content)
  await submit(page)
  await expect(page.locator('input[name="data-date"]:invalid')).toHaveCount(0)
})

test('data-number change required', async ({ page }) => {
  await expect(page.locator('input[name="data-number"]:required')).toHaveCount(0)
  await page.locator('#data-number .q-required').check()
  await expect(page.locator('input[name="data-number"]:required')).toHaveCount(1)
})

test('data-number validate', async ({ page }) => {
  const content = '123'
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('data-number')).toEqual(content)
  })

  await page.locator('#data-number .q-required').check()
  await submit(page)
  await expect(page.locator('input[name="data-number"]:invalid')).toHaveCount(1)

  await expect(page.locator('input[name="data-number"]').fill('test')).rejects.toThrow()
  await submit(page)
  await expect(page.locator('input[name="data-number"]:invalid')).toHaveCount(1)

  await page.locator('input[name="data-number"]').fill(content)
  await submit(page)
  await expect(page.locator('input[name="data-number"]:invalid')).toHaveCount(0)
})
