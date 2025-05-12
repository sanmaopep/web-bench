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

test('drag and check .contents-item 1 & 2', async ({ page }) => {
  const item1 = page.locator('.contents .contents-item:nth-child(1)')
  const item2 = page.locator('.contents .contents-item:nth-child(2)')
  const text1 = (await item1.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const text2 = (await item2.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const offset1 = await getOffsetByLocator(item1)

  await item2.hover() // scroll to it
  await page.mouse.down()
  await item1.hover({ position: { x: offset1.width / 2, y: 0 } })
  await page.mouse.up()

  await expect(item1).toContainText(text2)
  await expect(item2).toContainText(text1)
})

test('drag .contents-item 1 & 2, and check .q', async ({ page }) => {
  const item1 = page.locator('.contents .contents-item:nth-child(1)')
  const item2 = page.locator('.contents .contents-item:nth-child(2)')
  const offset1 = await getOffsetByLocator(item1)
  const q1 = page.locator('form .q').nth(0)
  const q2 = page.locator('form .q').nth(1)
  const text1 = (await q1.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const text2 = (await q2.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`

  await item2.hover() // scroll to it
  await page.mouse.down()
  await item1.hover({ position: { x: offset1.width / 2, y: 0 } })
  await page.mouse.up()

  await expect(q2).toContainText(text1)
  await expect(q1).toContainText(text2)
})

test('drag .contents-item 1 & 10, and check .q', async ({ page }) => {
  const item1 = page.locator('.contents .contents-item:nth-child(1)')
  const item2 = page.locator('.contents .contents-item:nth-child(2)')
  const item10 = page.locator('.contents .contents-item:nth-child(10)')
  const offset1 = await getOffsetByLocator(item1)
  const text1 = (await item1.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const text10 = (await item10.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const q1 = page.locator('form .q').nth(0)
  const q2 = page.locator('form .q').nth(1)
  const q10 = page.locator('form .q').nth(9)
  const qtext1 = (await q1.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const qtext10 = (await q10.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`

  await item10.hover() // scroll to it
  await page.mouse.down()
  await item1.hover({ position: { x: offset1.width / 2, y: 0 } })
  await page.mouse.up()

  await expect(item1).toContainText(text10)
  await expect(item2).toContainText(text1)
  await expect(q1).toContainText(qtext10)
  await expect(q2).toContainText(qtext1)
})
