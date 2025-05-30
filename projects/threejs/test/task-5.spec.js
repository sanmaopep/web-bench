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
 * Check the availability of user's up, down, left, and right operations
 */

const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')

const { checkIsInLine } = require('../test-utils')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check snake body number', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const snake = (scene.children || []).find((child) => {
    return child.name === 'snake'
  })
  const snakeBody = snake.children?.filter((child) => {
    return child.name !== 'snake_head'
  })
  expect(snakeBody?.length).toBe(3)
})

test('Check snake body geometry', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const snake = (scene.children || []).find((child) => {
    return child.name === 'snake'
  })
  const snakeBody = snake.children?.filter((child) => {
    return child.name !== 'snake_head'
  })
  const body = snakeBody[0]
  expect(body.geometry.type).toBe('SphereGeometry')
  expect(body.geometry.parameters.radius).toBe(0.5)
})

/**
 * Because subsequent tasks will repeatedly run this test, it can verify whether the body remains connected in a line after movement.
 */
test('Check snake body is one by one', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const snake = (scene.children || []).find((child) => {
    return child.name === 'snake'
  })
  const snakeHead = snake.children?.find((child) => {
    return child.name === 'snake_head'
  })
  const snakeBody = snake.children?.filter((child) => {
    return child.name !== 'snake_head'
  })

  const bodyList = snakeBody.map((body) => {
    return [body.position.x, body.position.z]
  })

  const isLine = checkIsInLine(
    [snakeHead.position.x, snakeHead.position.z],
    bodyList.reduce((pre, cur) => {
      return {
        ...pre,
        [`${cur[0]}:${cur[1]}`]: true,
      }
    }, {})
  )

  expect(isLine).toBe(true)
})

/**
 * Verify the orientation of the snake's body.
 */
test('Check snake body direction', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const snake = (scene.children || []).find((child) => {
    return child.name === 'snake'
  })
  const snakeBody = snake.children?.filter((child) => {
    return child.name !== 'snake_head'
  })

  const bodyList = snakeBody.map((body) => {
    return [body.position.x, body.position.z]
  })

  const isExistBottomBody = bodyList.some(([x, z]) => {
    return x === 0 && z === 3
  })

  expect(isExistBottomBody).toBe(true)
})
