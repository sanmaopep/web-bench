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

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test(`Fill fo"`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('fo', {
    delay: 50,
  })

  expect(await page.getByText('foo', { exact: true }).count()).toBe(1)
  expect(await page.getByText('fooooo', { exact: true }).count()).toBe(1)

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')

  await expect(editor).toHaveText('foo')

  await editor.pressSequentially(' an', {
    delay: 50,
  })

  await page.keyboard.press('Enter')

  await expect(editor).toHaveText('foo AND')

  await editor.pressSequentially(' ba', {
    delay: 50,
  })

  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('Enter')

  await expect(editor).toHaveText('foo AND barrrr')
})