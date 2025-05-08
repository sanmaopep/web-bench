/**
 * 检测边缘碰撞体积，围栏的正确放置
 */

const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')
const { getSnakeHead } = require('../test-utils')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('Check fences group exist.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');

  const fencesGroup = scene.children.find(c => c.name === 'fences');

  expect(fencesGroup).toBeDefined();
})

test('Check fences number correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');

  const fencesGroup = scene.children.find(c => c.name === 'fences');

  const fencesExpectNumber = 9 * 2 + 7 * 2; // 这是 9 * 9 的棋盘。 x轴： -4 到 4  y轴：-4 到 4

  expect(fencesGroup.children.length).toBe(fencesExpectNumber);
})

test('Check fences position correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');



  const fencesGroup = scene.children.find(c => c.name === 'fences');

  const fencesExpectPositionMap = {};

  const _y = 0.5;

  const getKey = (arr) => {
    return arr.join('$');
  }

  for (let _x = -4; _x <= 4; _x++) {
    for (let _z = -4; _z <= 4; _z++) {
      if (Math.abs(_x) === 4 || Math.abs(_z) === 4) {
        fencesExpectPositionMap[getKey([_x, _y, _z])] = true;
      }
    }
  }

  fencesGroup.children.forEach(child => {
    const { x, y, z } = child.position;
    const key = getKey([x, y, z]);
    if (fencesExpectPositionMap[key]) {
      delete fencesExpectPositionMap[key];
    }
  })

  expect(Object.keys(fencesExpectPositionMap).length).toBe(0);
})


test('Check fences collision detection active: Left', async ({ page }) => {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowLeft');
  }

  const snakeHead = await getSnakeHead(page);

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(-3);
  expect(z).toBe(0);
})

test('Check fences collision detection active: Up', async ({ page }) => {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowUp');
  }

  const snakeHead = await getSnakeHead(page);

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(0);
  expect(z).toBe(-3);
})


test('Check fences collision detection active: Down', async ({ page }) => {
  /**
   * 这里先左转一下是因为，生成的蛇是自南向北的，所以要先转头
   */
  await page.keyboard.press('ArrowLeft');
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowDown');
  }

  const snakeHead = await getSnakeHead(page);

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(-1);
  expect(z).toBe(3);
})

test('Check fences collision detection active: Right', async ({ page }) => {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowRight');
  }

  const snakeHead = await getSnakeHead(page);

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(3);
  expect(z).toBe(0);
})

test('Check fences collision detection active: Combine Top & Left', async ({ page }) => {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowUp');
  }

  const snakeHead = await getSnakeHead(page);

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(-3);
  expect(z).toBe(-3);
})