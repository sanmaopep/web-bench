const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Tooltip Default Hidden', async ({ page }) => {
  await expect(page.getByText('Write a New Blog For everyone')).toBeHidden()
})

test('Check Tooltip Appear', async ({ page }) => {
  await page.getByText('Add Blog').hover()
  await expect(page.getByText('Write a New Blog For everyone')).toBeVisible()

  // Hover over another element, tooltip disappears
  await page.getByText('Hello Blog').hover()
  await expect(page.getByText('Write a New Blog For everyone')).toBeHidden()
})

test('Check Tooltip Position', async ({ page }) => {
  await page.getByText('Add Blog').hover()

  // Tooltip is below the Add Blog, distance should not be too far
  const c1 = await getOffset(page, ':text("Add Blog")')
  const c2 = await getOffset(page, '.tooltip')

  const deltaY = c2.top - c1.bottom
  const deltaX = c2.centerX - c1.centerX

  expect(deltaY).toBeLessThanOrEqual(100)
  expect(deltaX).toBeLessThanOrEqual(100)
})

test('Check Tooltip is the child of document.body', async ({ page }) => {
  await page.getByText('Add Blog').hover()

  const parentIsBody = await page.evaluate(() => {
    const tooltip = document.querySelector('.tooltip')
    return (
      tooltip.parentElement === document.body ||
      // For some reason, tooltip is wrapped by a div
      tooltip.parentElement?.parentElement === document.body
    )
  })

  expect(parentIsBody).toBe(true)
})

test('Check Update Position When Browser Resize', async ({ page }) => {
  await page.setViewportSize({ width: 400, height: 600 })
  await page.getByText('Add Blog').hover()

  // Tooltip is below the Add Blog, distance should not be too far
  const c1 = await getOffset(page, ':text("Add Blog")')
  const c2 = await getOffset(page, '.tooltip')

  const deltaY = c2.top - c1.bottom
  const deltaX = c2.centerX - c1.centerX

  expect(deltaY).toBeLessThanOrEqual(100)
  expect(deltaX).toBeLessThanOrEqual(100)
})
