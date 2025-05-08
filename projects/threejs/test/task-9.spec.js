const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')
const { checkIsInLine } = require('../test-utils')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

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

test('Check snake eat candy growth and in line.', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowUp');
  }

  const { scene } = await getWindowMirror(page, 'scene');


  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })
  const snakeHead = snake.children?.find(child => {
    return child.name === 'snake_head';
  })
  const snakeBody = snake.children?.filter(child => {
    return child.name !== 'snake_head';
  })

  const bodyList = snakeBody.map(body => {
    return [body.position.x, body.position.z]
  })

  const isLine = checkIsInLine([snakeHead.position.x, snakeHead.position.z], bodyList.reduce((pre, cur) => {
    return {
      ...pre,
      [`${cur[0]}:${cur[1]}`]: true
    }
  }, {}));

  expect(isLine).toBe(true);
  expect(snakeBody.length).toBe(4);
})