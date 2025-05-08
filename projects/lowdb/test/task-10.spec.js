const { test, expect } = require('@playwright/test')
const { pageLoginUser, pageLoginAdmin } = require('@web-bench/shop-test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Regular user accessing own profile', async ({ page }) => {
  await pageLoginUser(page)

  await page.goto('/profile/user')
  await expect(page).toHaveURL('/profile/user')
  await expect(page.locator('.profile-username')).toBeVisible()
  await expect(page.locator('.profile-coin')).toBeVisible()
})

test('Profile Page is static', async ({ page }) => {
  await pageLoginAdmin(page)

  const response = await page.request.get('/profile/admin')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/html')
  // User Name in rendered in HTML
  expect(await response.text()).toContain('admin')
})

test('Regular user accessing other profile', async ({ page }) => {
  await pageLoginUser(page)

  await page.goto('/profile/admin')
  await expect(page).toHaveURL('/login')
})

test('Admin accessing other profile', async ({ page }) => {
  await pageLoginAdmin(page)
  await page.goto('/profile/user')

  await expect(page).toHaveURL('/profile/user')
  await expect(page.locator('.profile-username')).toHaveText('user')
  await expect(page.locator('.profile-coin')).toBeVisible()
})

test('Redirect to login for unauthenticated profile access', async ({ page }) => {
  await page.goto('/profile/user')
  await expect(page).toHaveURL('/login')
})
