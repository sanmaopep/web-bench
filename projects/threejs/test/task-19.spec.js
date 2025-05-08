const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util');
const { getSnakeHead } = require('../test-utils');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


test('Check snake color change!', async ({ page }) => {
  const previousColor = await page.evaluate(() => {
    const snake = scene.getObjectByName('snake');
    const snakeHead = snake.getObjectByName('snake_head');
    return snakeHead.material.color.toArray()
  });

  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowUp');
  }
  const { scene } = await getWindowMirror(page, 'scene');

  let colorArr = await page.evaluate(() => {
    const snake = scene.getObjectByName('snake');
    const color = snake.children.map(obj => obj.material.color.toArray());
    return color;
  });

  colorArr = colorArr.map(arr => {
    return arr.map(num => num.toFixed(5));
  })

  const isDifferent = colorArr.some(c => {
    return c.join('-') !== colorArr[0].join('-');
  })

  expect(isDifferent).toBe(false);

  expect(colorArr[0].join('-') === previousColor).toBe(false);
})
