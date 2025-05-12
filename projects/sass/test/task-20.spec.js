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
const { isDeepStrictEqual } = require('util')

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('question .add button', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add-single').click()

  await expect(page.locator('.q .add').nth(0)).toBeVisible()
  await expect(page.locator('.q .add').nth(1)).toBeVisible()
})

test('popup', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add').click()
  await expect(page.locator('.popup')).toBeVisible()
  await page.locator('body').click()
  await expect(page.locator('.popup')).toBeHidden()
})

test('popup add question', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add').click()
  await expect(page.locator('.popup')).toBeVisible()
  await expect(page.locator('.q')).toHaveCount(1)
  await page.locator('.popup .add-question').click()
  await expect(page.locator('.q')).toHaveCount(2)
})

test('popup insert after question', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add-question').click()
  await expect(page.locator('.q')).toHaveCount(2)
  
  await page.locator('.add').nth(0).click()
  await page.locator('.popup .add-single').click()
  await expect(page.locator('.q')).toHaveCount(3)
  await expect(page.locator('.q').nth(1).locator('.option')).toHaveCount(3)
  await expect(page.locator('.contents-item')).toHaveCount(3)
})
