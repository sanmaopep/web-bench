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
const { getWindowMirror, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

/**
 * h - snake head
 * b - snake body
 * c - candy
 * * - floor
 *
 * | c * * * * * * |
 * | * * * * * * * |
 * | * * * * * * * |
 * | * * * h * * * |
 * | * * * b * * * |
 * | * * * b * * * |
 * | * * * b * * * |
 */

test('Check candy exist', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const candy = scene.children.find((c) => c.name === 'candy')

  expect(candy).toBeDefined()
})

test('Check candy geometry', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const candy = scene.children.find((c) => c.name === 'candy')

  expect(candy.geometry.type).toBe('SphereGeometry')
  expect(candy.geometry.type).toBe('SphereGeometry')
  expect(candy.geometry.parameters.radius).toBe(0.3)
})

test('Check candy position', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const candy = scene.children.find((c) => c.name === 'candy')

  expect(candy.position.x).toBe(-3)
  expect(candy.position.z).toBe(-3)
  // y is not detected here because up and down animations will be added later.
})

/**
 * Absolute positions are prefabricated here because the snake and chessboard generated according to the description are of fixed size and position.
 * This also checks that the candy is not generated on the snake body.
 */

/**
 * h - snake head
 * b - snake body
 * c - candy
 * * - floor
 *
 * | h c * * * * * |
 * | b b * * * * * |
 * | * b b * * * * |
 * | * * * * * * * |
 * | * * * * * * * |
 * | * * * * * * * |
 * | * * * * * * * |
 */
test('Check candy can be ate and recreated in new position.', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowLeft')
  }

  const { scene } = await getWindowMirror(page, 'scene')

  const candy = scene.children.find((c) => c.name === 'candy')

  expect(candy.position.x).toBe(-1)
  expect(candy.position.z).toBe(-3)
})
