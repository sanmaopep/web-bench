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

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

async function isInFullscreen(page) {
  return page.evaluate(() => document.fullscreenElement?.classList.contains('content'))
}

test('.fullscreen', async ({ page }) => {
  await expect(await page.evaluate(() => document.fullscreenEnabled)).toBeTruthy()
  await expect(page.locator('.fullscreen')).toBeVisible()
})

test('click .fullscreen', async ({ page }) => {
  await page.locator('.fullscreen').click()
  expect(await isInFullscreen(page)).toBeTruthy()
})

test('exit .fullscreen', async ({ page }) => {
  await page.locator('.fullscreen').click()
  expect(await isInFullscreen(page)).toBeTruthy()
  await page.evaluate(() => document.exitFullscreen())
  expect(await isInFullscreen(page)).toBeFalsy()

  // await page.locator('.fullscreen').click()
  // expect(await isInFullscreen(page)).toBeTruthy()
  // const contentFrame = page.frame('content')
  // await contentFrame?.page().keyboard.press('Escape')
  // await page.keyboard.press('Escape')
  // expect(await isInFullscreen(page)).toBeFalsy()
})

test('click .exit-fullscreen', async ({ page }) => {
  await page.locator('.fullscreen').click()
  expect(await isInFullscreen(page)).toBeTruthy()

  const contentFrame = page.frame('content')
  await contentFrame?.locator('.exit-fullscreen').click()
  expect(await isInFullscreen(page)).toBeFalsy()
})
