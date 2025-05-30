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

/**
 * Detect edge collision volume and correct placement of fences
 */

const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')
const { getSnakeHead } = require('../test-utils')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check fences group exist.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const fencesGroup = scene.children.find((c) => c.name === 'fences')

  expect(fencesGroup).toBeDefined()
})

test('Check fences number correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const fencesGroup = scene.children.find((c) => c.name === 'fences')

  const fencesExpectNumber = 9 * 2 + 7 * 2 // This is a 9 * 9 chessboard. x-axis: -4 to 4 y-axis: -4 to 4

  expect(fencesGroup.children.length).toBe(fencesExpectNumber)
})

test('Check fences position correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const fencesGroup = scene.children.find((c) => c.name === 'fences')

  const fencesExpectPositionMap = {}

  const _y = 0.5

  const getKey = (arr) => {
    return arr.join('$')
  }

  for (let _x = -4; _x <= 4; _x++) {
    for (let _z = -4; _z <= 4; _z++) {
      if (Math.abs(_x) === 4 || Math.abs(_z) === 4) {
        fencesExpectPositionMap[getKey([_x, _y, _z])] = true
      }
    }
  }

  fencesGroup.children.forEach((child) => {
    const { x, y, z } = child.position
    const key = getKey([x, y, z])
    if (fencesExpectPositionMap[key]) {
      delete fencesExpectPositionMap[key]
    }
  })

  expect(Object.keys(fencesExpectPositionMap).length).toBe(0)
})

test('Check fences collision detection active: Left', async ({ page }) => {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowLeft')
  }

  const snakeHead = await getSnakeHead(page)

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(-3)
  expect(z).toBe(0)
})

test('Check fences collision detection active: Up', async ({ page }) => {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowUp')
  }

  const snakeHead = await getSnakeHead(page)

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(0)
  expect(z).toBe(-3)
})

test('Check fences collision detection active: Down', async ({ page }) => {
  /**
   * The reason for turning left here is that the generated snake is from south to north, so it needs to turn its head first.
   */
  await page.keyboard.press('ArrowLeft')
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowDown')
  }

  const snakeHead = await getSnakeHead(page)

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(-1)
  expect(z).toBe(3)
})

test('Check fences collision detection active: Right', async ({ page }) => {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowRight')
  }

  const snakeHead = await getSnakeHead(page)

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(3)
  expect(z).toBe(0)
})

test('Check fences collision detection active: Combine Top & Left', async ({ page }) => {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowUp')
  }

  const snakeHead = await getSnakeHead(page)

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(-3)
  expect(z).toBe(-3)
})
