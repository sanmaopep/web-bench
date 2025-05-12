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
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Search Input is on the top of List', async ({ page }) => {
  const c1 = await getOffset(page, 'input[placeholder="Search Blogs"]')
  const c2 = await getOffset(page, '.list-item')
  expect(c1.centerY).toBeLessThan(c2.centerY)
})

test('Search Blogs', async ({ page }) => {
  const title = 'HappyHappyHappyHappy'

  await page.getByPlaceholder('Search Blogs').fill(title)

  const happy = page.locator(`.list-item:has-text("Mock_${title}")`)
  await expect(happy).toBeVisible()
  await expect(page.getByText('Morning')).toBeHidden()

  await happy.click()
  await expect(page.getByText(`Mock Search ${title} Detail`)).toBeVisible()
})

test('Fast Typing Keyword of Search Blogs, make sure the result is latest Search', async ({
  page,
}) => {
  let sumKeywords = ''
  const title = 'HappyHappyHappyHappy'

  for (const letter of title) {
    sumKeywords += letter
    await page.getByPlaceholder('Search Blogs').fill(sumKeywords)
  }

  const happy = page.locator(`.list-item:has-text("Mock_${title}")`)
  await expect(happy).toBeVisible()
  await happy.click()
  await expect(page.getByText(`Mock Search ${title} Detail`)).toBeVisible()
})

test('Search Input width should be less than the size of component: 200px', async ({ page }) => {
  const c1 = await getOffset(page, 'input[placeholder="Search Blogs"]')

  expect(c1.width).toBeLessThanOrEqual(200)
})
