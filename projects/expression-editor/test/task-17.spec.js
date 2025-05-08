const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

const delay = 10

test(`evaluate "foo and bar"`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo and bar', { delay })
  await page.getByText('Run').click()
  await expect(page.getByText('null')).toBeInViewport()
})

test(`evaluate "foo A"`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo A', { delay })
  await page.getByText('Run').click()
  await expect(page.getByText('null')).toBeInViewport()
})

test(`evaluate "foo AND bar"`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo AND bar', { delay })
  await page.getByText('Run').click()
  await expect(page.getByText('true')).toBeInViewport()
})

test(`evaluate "foo AND (bar OR barrrr)"`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.fill('foo AND (bar OR barrrr)')
  await page.getByText('Run').click()
  await expect(page.getByText('true')).toBeInViewport()
})

