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

test(`Should CSS work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(await getColor(page.getByText('hello css'))).toBe('rgb(0, 0, 255)')
})

test(`Should less work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(await getColor(page.getByText('hello less', { exact: true }))).toBe('rgb(0, 255, 0)')
})

test(`Should less modules work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(await getColor(page.getByText(`hello less modules`, { exact: true }))).toBe('rgb(255, 0, 0)')
})

async function getColor(element) {
  return await element.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('color')
  })
}