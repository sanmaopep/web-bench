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
const tinycolor = require('tinycolor2')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test(`Syntax highlight should work - foo AND bar`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo AND bar', {
    delay: 50,
  })

  await expect(editor).toHaveText('foo AND bar')

  expect(
    toHexColor(
      await getColor(editor.getByText(/foo/))
    )
  ).toBe('#0000ff') // blue
  expect(
    toHexColor(
      await getColor(editor.getByText(/AND/))
    )
  ).toBe('#00ff00') // green
  expect(
    toHexColor(
      await getColor(editor.getByText(/bar/))
    )
  ).toBe('#0000ff') // blue
})

test(`Syntax highlight should work - foo and bar`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo and bar', {
    delay: 50,
  })

  await expect(editor).toHaveText('foo and bar')

  expect(
    toHexColor(
      await getColor(editor.getByText(/foo/))
    )
  ).toBe('#0000ff') // blue
  expect(
    toHexColor(
      await getColor(editor.getByText(/bar/))
    )
  ).toBe('#0000ff') // blue
})

async function getColor(element) {
  return await element.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('color')
  })
}

function toHexColor(color) {
  return tinycolor(color).toHexString().toLowerCase()
}