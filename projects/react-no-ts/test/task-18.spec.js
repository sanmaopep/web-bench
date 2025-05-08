const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Jump to game when click "🎮"', async ({ page }) => {
  await page.getByText('🎮').click()
  await expect(page).toHaveURL('/game')
  await expect(page.getByText('Hello Game')).toBeVisible()
  await expect(page.getByText('Hello Blog')).toBeHidden()
})

test('Page switched when page goBack and goForward', async ({ page }) => {
  await page.getByText('🎮').click()
  await page.goBack()

  await expect(page).toHaveURL('/')
  await expect(page.getByText('Hello Game')).toBeHidden()
  await expect(page.getByText('Hello Blog')).toBeVisible()

  await page.goForward()
  await expect(page).toHaveURL('/game')
  await expect(page.getByText('Hello Game')).toBeVisible()
  await expect(page.getByText('Hello Blog')).toBeHidden()
})

test('show Game Page when goto /game directly', async ({ page }) => {
  await page.goto('/game')
  await expect(page.getByText('Hello Game')).toBeVisible()
  await expect(page.getByText('Hello Blog')).toBeHidden()
})
