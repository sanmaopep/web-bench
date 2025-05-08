const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  test.setTimeout(5000)
})

test('Toast When Submit Comment, Toast disappear after 3000ms', async ({ page }) => {
  await page.getByPlaceholder('Enter Your Comment').fill('Morning is Good! I love Morning!')
  await page.locator('.comment-btn').click()

  await expect(page.getByText('New Comment Created Success').first()).toBeVisible()
  await page.waitForTimeout(2001)
  await expect(page.getByText('New Comment Created Success').first()).toBeHidden()
})

test('New Toast Will replace Old Toast', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('Night')
  await page.getByLabel('detail').fill('Good night')
  await page.locator('.submit-btn').click()

  await expect(page.getByText('New Blog Created Success').first()).toBeVisible()

  await page.getByPlaceholder('Enter Your Comment').fill('Night is Good! I love Night!')
  await page.locator('.comment-btn').click()

  await expect(page.getByText('New Comment Created Success').first()).toBeVisible()
})

test('Toast is in the top of page', async ({ page }) => {
  await page.getByPlaceholder('Enter Your Comment').fill('Morning is Good! I love Morning!')
  await page.locator('.comment-btn').click()

  const c1 = await getOffset(page, ':text("New Comment Created Success")')
  const c2 = await getOffset(page, 'body')

  expect(c1.centerY).toBeLessThan(c2.centerY)
})

test('Toast fontSize is 12px', async ({ page }) => {
  await page.getByPlaceholder('Enter Your Comment').fill('Morning is Good! I love Morning!')
  await page.locator('.comment-btn').click()

  const toast = page.getByText('New Comment Created Success').first()
  await expect(toast).toBeVisible()
  await expect(toast).toHaveCSS('font-size', '12px')
})
