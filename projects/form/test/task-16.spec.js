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

test('question title index', async ({ page }) => {
  const qcount = await page.locator('form .q-title').count()
  await expect(qcount).toBeGreaterThanOrEqual(10)
  const count = await page.locator('.contents .contents-item').count()
  await expect(count).toBeGreaterThanOrEqual(10)

  await expect(page.locator('form .q-title').nth(0)).toContainText(/^1\./)
  await expect(page.locator('form .q-title').nth(9)).toContainText(/^10\./)

  await expect(page.locator('.contents .contents-item').nth(0)).toContainText(/^1\./)
  await expect(page.locator('.contents .contents-item').nth(9)).toContainText(/^10\./)
})

test('move question & title index', async ({ page }) => {
  const item1 = page.locator('.contents .contents-item:nth-child(1)')
  const item2 = page.locator('.contents .contents-item:nth-child(2)')
  const text1 = (await item1.textContent()) ?? `${+new Date()}`
  const text2 = (await item2.textContent()) ?? `${+new Date()}`
  const offset1 = await getOffsetByLocator(item1)

  await item2.hover() // scroll to it
  await page.mouse.down()
  await item1.hover({ position: { x: offset1.width / 2, y: 0 } })
  await page.mouse.up()

  await expect(item1).not.toHaveText(text2)
  await expect(item2).not.toHaveText(text1)

  await expect(page.locator('form .q-title').nth(0)).toContainText(/^1\./)
  await expect(page.locator('form .q-title').nth(1)).toContainText(/^2\./)

  await expect(page.locator('.contents .contents-item').nth(0)).toContainText(/^1\./)
  await expect(page.locator('.contents .contents-item').nth(1)).toContainText(/^2\./)
})
