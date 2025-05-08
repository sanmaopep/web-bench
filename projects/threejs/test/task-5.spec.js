/**
 * 检测用户上下左右操作可用性
 */

const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')

const { checkIsInLine } = require('../test-utils')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('Check snake body number', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');

  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })
  const snakeBody = snake.children?.filter(child => {
    return child.name !== 'snake_head';
  })
  expect(snakeBody?.length).toBe(3);
})

test('Check snake body geometry', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');

  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })
  const snakeBody = snake.children?.filter(child => {
    return child.name !== 'snake_head';
  })
  const body = snakeBody[0];
  expect(body.geometry.type).toBe('SphereGeometry');
  expect(body.geometry.parameters.radius).toBe(0.5);
})

/**
 * Because subsequent tasks will repeatedly run this test, it can verify whether the body remains connected in a line after movement.
 */
test('Check snake body is one by one', async ({ page }) => {
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
})

/**
 * Verify the orientation of the snake's body.
 */
test('Check snake body direction', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');

  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })
  const snakeBody = snake.children?.filter(child => {
    return child.name !== 'snake_head';
  })

  const bodyList = snakeBody.map(body => {
    return [body.position.x, body.position.z]
  })

  const isExistBottomBody = bodyList.some(([x, z]) => {
    return x === 0 && z === 3;
  })

  expect(isExistBottomBody).toBe(true);
})
