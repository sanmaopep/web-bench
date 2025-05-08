const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('Check snake group exist.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })
  expect(snake).toBeDefined();
})

test('Check snake group position correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })
  expect(snake.position.x).toBe(0);
  expect(snake.position.z).toBe(0);
})

test('Check snake_head exist and position correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })
  const snake_head = snake.children.find(c => c.name === 'snake_head');

  expect(snake_head).toBeDefined();
  expect(snake_head.name).toBe('snake_head');
})

test('Check snake_head position correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })

  const snake_head = snake.children.find(c => c.name === 'snake_head');

  expect(snake_head.position.x).toBe(0);
  expect(snake_head.position.z).toBe(0);
})

test('Check snake_head geometry.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })
  const snake_head = snake.children[0];
  expect(snake_head.geometry.type).toBe('ConeGeometry');
  expect(snake_head.geometry.parameters.height).toBe(1);
  expect(snake_head.geometry.parameters.radius).toBe(0.5);
})
