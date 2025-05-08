const { test, expect } = require('@playwright/test')
const { sleep } = require('@web-bench/test-util')
const { getSnakeHead } = require('../test-utils')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


test('Check snake auto move: Up', async ({ page }) => {
  await page.keyboard.press('a');
  await sleep(3000);

  const snakeHead = await getSnakeHead(page);

  expect(snakeHead.position.x).toBe(0);
  expect(snakeHead.position.z).toBe(-3);
})

test('Check snake auto move: Left', async ({ page }) => {
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('a');
  await sleep(3000);

  const snakeHead = await getSnakeHead(page);

  expect(snakeHead.position.x).toBe(-3);
  expect(snakeHead.position.z).toBe(0);
})

test('Check snake auto move close', async ({ page }) => {
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('a');
  await sleep(1600);
  await page.keyboard.press('a');
  await page.keyboard.press('ArrowUp');
  const firstSnakeHead = await getSnakeHead(page);
  await sleep(1600);
  const lastSnakeHead = await getSnakeHead(page);

  expect(lastSnakeHead.position.x).toBe(firstSnakeHead.position.x);
  expect(lastSnakeHead.position.z).toBe(firstSnakeHead.position.z);
})
