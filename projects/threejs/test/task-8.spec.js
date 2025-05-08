const { test, expect } = require('@playwright/test')
const { getWindowMirror, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
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
  const { scene } = await getWindowMirror(page, 'scene');

  const candy = scene.children.find(c => c.name === 'candy');

  expect(candy).toBeDefined();
})

test('Check candy geometry', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');

  const candy = scene.children.find(c => c.name === 'candy');

  expect(candy.geometry.type).toBe('SphereGeometry');
  expect(candy.geometry.type).toBe('SphereGeometry');
  expect(candy.geometry.parameters.radius).toBe(0.3);
})

test('Check candy position', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');

  const candy = scene.children.find(c => c.name === 'candy');

  expect(candy.position.x).toBe(-3);
  expect(candy.position.z).toBe(-3);
  // 这里不检测 y 是因为后面会增加上下的动画。
})

/**
 * 这里都预制了绝对位置，因为按照描述生成的 snake 和 棋盘都是固定尺寸和位置。
 * 这里顺带还检测了 candy 生成的位置不会在 snake body 上
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
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowLeft');
  }

  const { scene } = await getWindowMirror(page, 'scene');

  const candy = scene.children.find(c => c.name === 'candy');

  expect(candy.position.x).toBe(-1);
  expect(candy.position.z).toBe(-3);
})
