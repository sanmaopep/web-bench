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
const TABLE_SIZE = 8
const { test, expect } = require('@playwright/test')
const { getWindowMirror, sleep } = require('@web-bench/test-util')
const { getSnakeHead } = require('../test-utils')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

function createBorderDisabledMap() {
  const map = {}
  const size = TABLE_SIZE / 2 - 1
  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      if (Math.abs(x) === size || Math.abs(z) === size) map[`${x}:${z}`] = true
    }
  }
  return map
}

function judgeCanMove(headPos, bodyPosList) {
  const disabledMap = {
    ...createBorderDisabledMap(),
    ...bodyPosList.reduce((pre, cur) => {
      return {
        ...pre,
        [`${cur[0]}:${cur[1]}`]: true,
      }
    }, {}),
  }

  const result = {
    n: !!disabledMap[`${headPos[0]}:${headPos[1] - 1}`], // Can move north
    s: !!disabledMap[`${headPos[0]}:${headPos[1] + 1}`],
    w: !!disabledMap[`${headPos[0] - 1}:${headPos[1]}`],
    e: !!disabledMap[`${headPos[0] + 1}:${headPos[1]}`],
  }

  return result
}

async function getCanMoveMap(page) {
  const { scene } = await getWindowMirror(page, 'scene')

  const snake = scene?.children?.find?.((c) => c.name === 'snake')
  const snakeHead = snake.children?.find((child) => {
    return child.name === 'snake_head'
  })
  const snakeBody = snake.children?.filter((child) => {
    return child.name !== 'snake_head'
  })

  const bodyList = snakeBody.map((body) => {
    return [body.position.x, body.position.z]
  })

  return {
    originPos: [snakeHead.position.x, snakeHead.position.z],
    enableMap: judgeCanMove([snakeHead.position.x, snakeHead.position.z], bodyList),
  }
}

test('Check snake move correct: ArrowLeft', async ({ page }) => {
  await page.keyboard.press('ArrowLeft')

  const { scene } = await getWindowMirror(page, 'scene')

  const snake = scene?.children?.find?.((c) => c.name === 'snake')
  const snakeHead = snake.children?.find((child) => {
    return child.name === 'snake_head'
  })

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(-1)
  expect(z).toBe(0)
})
test('Check snake move correct: ArrowRight', async ({ page }) => {
  await page.keyboard.press('ArrowRight')

  const { scene } = await getWindowMirror(page, 'scene')

  const snake = scene?.children?.find?.((c) => c.name === 'snake')
  const snakeHead = snake.children?.find((child) => {
    return child.name === 'snake_head'
  })

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(1)
  expect(z).toBe(0)
})
test('Check snake move correct: ArrowUp', async ({ page }) => {
  await page.keyboard.press('ArrowUp')

  const { scene } = await getWindowMirror(page, 'scene')

  const snake = scene?.children?.find?.((c) => c.name === 'snake')
  const snakeHead = snake.children?.find((child) => {
    return child.name === 'snake_head'
  })

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(0)
  expect(z).toBe(-1)
})

// This will also check the collision volume
test('Check snake move correct: ArrowDown', async ({ page }) => {
  await page.keyboard.press('ArrowDown')
  const { scene } = await getWindowMirror(page, 'scene')

  const snake = scene?.children?.find?.((c) => c.name === 'snake')
  const snakeHead = snake.children?.find((child) => {
    return child.name === 'snake_head'
  })

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(0)
  expect(x).toBe(0)
})
/**
 * Verify that there is no automatic movement. The large model may have inertia and move the automatic movement logic over.
 */
test('Check no move auto', async ({ page }) => {
  async function getPosition() {
    const { scene } = await getWindowMirror(page, 'scene')
    const snake = scene?.children?.find?.((c) => c.name === 'snake')
    const snakeHead = snake.children?.find((child) => {
      return child.name === 'snake_head'
    })

    return snakeHead.position || {}
  }
  const initPosition = await getPosition()

  await sleep(1500)

  const nextPosition = await getPosition()

  expect(initPosition.x).toBe(nextPosition.x)
  expect(initPosition.z).toBe(nextPosition.z)
  expect(initPosition.y).toBe(nextPosition.y)
})

async function getRotation(page) {
  const snakeHead = await getSnakeHead(page)

  return {
    x: snakeHead.rotation._x,
    y: snakeHead.rotation._y,
    z: snakeHead.rotation._z,
  }
}

/**
 * Verify snake head orientation
 * It is no longer verified here whether it is definitely possible to go up, because a straight line is generated during initialization. If an exception occurs during generation, an error will inevitably be reported.
 */
test('Check snake head apex: ArrowUp', async ({ page }) => {
  await page.keyboard.press('ArrowUp')
  const nextRotation = await getRotation(page)

  expect(nextRotation.x.toFixed(5)).toBe((-Math.PI / 2).toFixed(5))
  expect(nextRotation.z).toBe(0)
})
test('Check snake head apex: ArrowLeft', async ({ page }) => {
  await page.keyboard.press('ArrowLeft')
  const nextRotation = await getRotation(page)

  expect(nextRotation.x).toBe(0)
  expect(nextRotation.z.toFixed(5)).toBe((Math.PI / 2).toFixed(5))
})
test('Check snake head apex: ArrowDown', async ({ page }) => {
  await page.keyboard.press('ArrowLeft')
  const nextRotation = await getRotation(page)

  expect(nextRotation.x).toBe(0)
  expect(nextRotation.z.toFixed(5)).toBe((Math.PI / 2).toFixed(5))
})

/**
 * This verifies that the angle cannot be rotated after a collision.
 */
test('Check snake head apex: ArrowDown error by self body', async ({ page }) => {
  const originRotation = await getRotation(page)

  await page.keyboard.press('ArrowDown')

  const nextRotation = await getRotation(page)

  expect(nextRotation.x.toFixed(5)).toBe(originRotation.x.toFixed(5))
  expect(nextRotation.y.toFixed(5)).toBe(originRotation.y.toFixed(5))
  expect(nextRotation.z.toFixed(5)).toBe(originRotation.z.toFixed(5))
})

/**
 * This verifies that other keyboard keys do not affect the snake's movement. Spot check alt
 */
test('Check other keyboard has no response: Alt', async ({ page }) => {
  await page.keyboard.press('Alt')

  const { scene } = await getWindowMirror(page, 'scene')

  const snake = scene?.children?.find?.((c) => c.name === 'snake')
  const snakeHead = snake.children?.find((child) => {
    return child.name === 'snake_head'
  })

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(0)
  expect(x).toBe(0)
})
/**
 * Spot check Enter
 */
test('Check other keyboard has no response: Enter', async ({ page }) => {
  await page.keyboard.press('Enter')

  const { scene } = await getWindowMirror(page, 'scene')

  const snake = scene?.children?.find?.((c) => c.name === 'snake')
  const snakeHead = snake.children?.find((child) => {
    return child.name === 'snake_head'
  })

  const { x, y, z } = snakeHead.position || {}

  expect(x).toBe(0)
  expect(z).toBe(0)
})
