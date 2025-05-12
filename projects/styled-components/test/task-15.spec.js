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
const { submitBlog } = require('./utils/helpers')
const { sleep, getComputedStyle, getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  await submitBlog(page, {
    title: 'TestBlog',
    content: 'TestContent',
  })
})

test('Test toast display', async ({ page }) => {
  const toast = page.locator('.toast')
  await expect(toast).toBeVisible()
  await expect(toast).toHaveText('New Blog Created Successfully!')
})

test('Test toast fontSize', async ({ page }) => {
  const style = await getComputedStyle(page, '.toast')
  expect(style.fontSize).toBe('12px')
})

test('Test toast position: at the top of the page', async ({ page }) => {
  const c1 = await getOffset(page, '.toast')
  const height = page.viewportSize().height

  expect(c1.centerY).toBeLessThan(height / 2)
})

test('Test toast disappeared after 2000ms', async ({ page }) => {
  const toast = page.locator('.toast')
  await expect(toast).toBeVisible()

  await sleep(2000)

  await expect(toast).not.toBeVisible()
})
