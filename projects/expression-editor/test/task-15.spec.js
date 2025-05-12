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

const delay = 10

test(`"foo an" shall report Syntax Error`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo an', {
    delay,
  })

  await expect(page.getByText('Syntax Error')).toBeVisible()
})

test(`"foo AND bar a" shall report Syntax Error`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo AND bar a', {
    delay,
  })

  await expect(page.getByText('Syntax Error')).toBeVisible()
})

test(`"(foo AND bar" shall report Syntax Error`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('(foo AND bar', {
    delay,
  })

  await expect(page.getByText('Syntax Error')).toBeVisible()
})

test(`"foo and bar" shall not report Syntax Error`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo and bar', {
    delay,
  })

  await expect(page.getByText('Syntax Error')).not.toBeVisible()
})