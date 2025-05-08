const { test, expect } = require('@playwright/test')
const { pageLoginUser, pageRegisterUser } = require('@web-bench/shop-test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Header menu display before login', async ({ page }) => {
  await expect(page.locator('.header-go-login')).toBeVisible()
  await page.locator('.header-go-login').click()
  await expect(page).toHaveURL('/login')
})

test('Refresh Header menu display after login', async ({ page }) => {
  await expect(page.locator('.header-go-login')).toBeVisible()

  await pageLoginUser(page)
  await expect(page.locator('.header-username')).toBeVisible()
  await expect(page.locator('.header-username')).toContainText('user')
  await expect(page.locator('.header-go-login')).not.toBeVisible()
})

test('Refresh Header menu display after register', async ({ page }) => {
  await pageRegisterUser(page, 'user_for_task_11')
  await expect(page.locator('.header-username')).toContainText('user_for_task_11')
})

test('Header dropdown menu on hover', async ({ page }) => {
  await pageLoginUser(page)

  await expect(page.locator('.header-logout-btn')).not.toBeVisible()
  await expect(page.locator('.header-go-user-profile')).not.toBeVisible()
  await page.hover('.header-username')

  await expect(page.locator('.header-logout-btn')).toBeVisible()
  await expect(page.locator('.header-go-user-profile')).toBeVisible()
})

test('Logout functionality', async ({ page }) => {
  await pageLoginUser(page)

  await page.hover('.header-username')
  await page.locator('.header-logout-btn').click()

  // Show Go to Login Button, not user name
  await expect(page.locator('.header-username')).not.toBeVisible()
  await expect(page.locator('.header-go-login')).toBeVisible()
})

test('Profile page navigation', async ({ page }) => {
  await pageLoginUser(page)
  await page.hover('.header-username')
  await page.locator('.header-go-user-profile').click()
  await expect(page).toHaveURL('/profile/user')
})
