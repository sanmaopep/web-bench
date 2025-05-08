const { test, expect } = require('@playwright/test')
const { submitBlog } = require('./utils/helpers')
const { sleep, getComputedStyle, getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  await submitBlog(page, {
    title: 'TestBlog',
    content: 'TestContent',
  })
})

test('Test toast display', async ({ page }) => {
  const toast = page.locator('.toast')
  await expect(toast).toBeVisible()
  await expect(toast).toHaveText('New Blog Created Successfully!')
})

test('Test toast fontSize', async ({ page }) => {
  const style = await getComputedStyle(page, '.toast')
  expect(style.fontSize).toBe('12px')
})

test('Test toast position: at the top of the page', async ({ page }) => {
  const c1 = await getOffset(page, '.toast')
  const height = page.viewportSize().height

  expect(c1.centerY).toBeLessThan(height / 2)
})

test('Test toast disappeared after 2000ms', async ({ page }) => {
  const toast = page.locator('.toast')
  await expect(toast).toBeVisible()

  await sleep(2000)

  await expect(toast).not.toBeVisible()
})
