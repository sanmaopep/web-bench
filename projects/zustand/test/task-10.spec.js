const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Jump to Login when click "🔑"', async ({ page }) => {
  await page.getByText('🔑').click()
  await expect(page).toHaveURL('/login')
  await expect(page.getByText('User Login')).toBeVisible()
  await expect(page.getByText('Morning My Friends')).toBeHidden()

  // Header is always visible
  await expect(page.getByText('Hello Blog')).toBeVisible()
})

test('Page switched when page goBack and goForward', async ({ page }) => {
  await page.getByText('🔑').click()
  await page.goBack()

  await expect(page).toHaveURL('/')
  await expect(page.getByText('User Login')).toBeHidden()
  await expect(page.getByText('Morning My Friends')).toBeVisible()

  // Header is always visible
  await expect(page.getByText('Hello Blog')).toBeVisible()

  await page.goForward()
  await expect(page).toHaveURL('/login')
  await expect(page.getByText('User Login')).toBeVisible()
  await expect(page.getByText('Morning My Friends')).toBeHidden()

  // Header is always visible
  await expect(page.getByText('Hello Blog')).toBeVisible()
})

test('show Game Page when goto /login directly', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByText('User Login')).toBeVisible()
  await expect(page.getByText('Morning My Friends')).toBeHidden()

  // Header is always visible
  await expect(page.getByText('Hello Blog')).toBeVisible()
})
