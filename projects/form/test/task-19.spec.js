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
  await page.goto('/index.html')
})

test('question config shuffle', async ({ page }) => {
  await expect(page.locator('#multi1 .q-config')).toBeVisible()
  await expect(page.locator('#single1 input[type="checkbox"].q-shuffle')).toBeVisible()
  await expect(page.locator('#multi1 input[type="checkbox"].q-shuffle')).toBeVisible()
  await expect(page.locator('#ranking1 input[type="checkbox"].q-shuffle')).toBeVisible()
})

test('multi1 shuffle', async ({ page }) => {
  await page.locator('#multi1 .q-shuffle').check()
  await page.locator('#multi1 .q-shuffle').uncheck()
  let values = [
    await page.locator('input[name="multi1"]').nth(0).inputValue(),
    await page.locator('input[name="multi1"]').nth(1).inputValue(),
    await page.locator('input[name="multi1"]').nth(2).inputValue(),
  ]
  await expect(values).toEqual(['0', '1', '2'])

  async function checkShuffle(page) {
    for (let i = 0; i < 20; i++) {
      await page.locator('#multi1 .q-shuffle').uncheck()
      await page.locator('#multi1 .q-shuffle').check()

      const values = [
        await page.locator('input[name="multi1"]').nth(0).inputValue(),
        await page.locator('input[name="multi1"]').nth(1).inputValue(),
        await page.locator('input[name="multi1"]').nth(2).inputValue(),
      ]
      // console.log(values)
      if (!isDeepStrictEqual(values, ['0', '1', '2'])) {
        return true
      }
    }
  }

  expect(await checkShuffle(page)).toBeTruthy()
})

test('ranking1 shuffle', async ({ page }) => {
  await page.locator('#ranking1 .q-shuffle').check()
  await page.locator('#ranking1 .q-shuffle').uncheck()
  let values = [
    await page.locator('#ranking1 .ranking-item').nth(0).getAttribute('data-index'),
    await page.locator('#ranking1 .ranking-item').nth(1).getAttribute('data-index'),
    await page.locator('#ranking1 .ranking-item').nth(2).getAttribute('data-index'),
  ]
  await expect(values).toEqual(['0', '1', '2'])

  async function checkShuffle(page) {
    for (let i = 0; i < 20; i++) {
      await page.locator('#ranking1 .q-shuffle').uncheck()
      await page.locator('#ranking1 .q-shuffle').check()

      const values = [
        await page.locator('#ranking1 .ranking-item').nth(0).getAttribute('data-index'),
        await page.locator('#ranking1 .ranking-item').nth(1).getAttribute('data-index'),
        await page.locator('#ranking1 .ranking-item').nth(2).getAttribute('data-index'),
      ]
      // console.log(values)
      if (!isDeepStrictEqual(values, ['0', '1', '2'])) {
        return true
      }
    }
  }

  expect(await checkShuffle(page)).toBeTruthy()
})

test('single1 shuffle - radio', async ({ page }) => {
  await page.locator('#single1 .q-shuffle').check()
  await page.locator('#single1 .q-shuffle').uncheck()
  let values = [
    await page.locator('input[name="single1"]').nth(0).inputValue(),
    await page.locator('input[name="single1"]').nth(1).inputValue(),
    await page.locator('input[name="single1"]').nth(2).inputValue(),
  ]
  await expect(values).toEqual(['0', '1', '2'])

  async function checkShuffle(page) {
    for (let i = 0; i < 20; i++) {
      await page.locator('#single1 .q-shuffle').uncheck()
      await page.locator('#single1 .q-shuffle').check()

      const values = [
        await page.locator('input[name="single1"]').nth(0).inputValue(),
        await page.locator('input[name="single1"]').nth(1).inputValue(),
        await page.locator('input[name="single1"]').nth(2).inputValue(),
      ]
      // console.log(values)
      if (!isDeepStrictEqual(values, ['0', '1', '2'])) {
        return true
      }
    }
  }

  expect(await checkShuffle(page)).toBeTruthy()
})

test('single1 shuffle - select', async ({ page }) => {
  await page.locator('#single1 .q-select').check()
  await page.locator('#single1 .q-select').uncheck()
  await page.locator('#single1 .q-select').check()

  await page.locator('#single1 .q-shuffle').check()
  await page.locator('#single1 .q-shuffle').uncheck()
  let values = [
    await page.locator('select[name="single1"] option').nth(0).getAttribute('value'),
    await page.locator('select[name="single1"] option').nth(1).getAttribute('value'),
    await page.locator('select[name="single1"] option').nth(2).getAttribute('value'),
  ]
  await expect(values).toEqual(['0', '1', '2'])

  async function checkShuffle(page) {
    for (let i = 0; i < 20; i++) {
      await page.locator('#single1 .q-shuffle').uncheck()
      await page.locator('#single1 .q-shuffle').check()

      const values = [
        await page.locator('select[name="single1"] option').nth(0).getAttribute('value'),
        await page.locator('select[name="single1"] option').nth(1).getAttribute('value'),
        await page.locator('select[name="single1"] option').nth(2).getAttribute('value'),
      ]
      // console.log(values)
      if (!isDeepStrictEqual(values, ['0', '1', '2'])) {
        return true
      }
    }
  }

  expect(await checkShuffle(page)).toBeTruthy()
})
