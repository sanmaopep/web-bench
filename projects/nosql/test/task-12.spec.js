const { test, expect } = require('@playwright/test')
const {
  pageLoginUser,
  pageRegisterUser,
  pageGetCurrentUserInfo,
  pageLoginAdmin,
} = require('@web-bench/shop-test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Recharge button visibility in own profile', async ({ page }) => {
  await pageLoginUser(page)
  await page.goto('/profile/user')
  await expect(page.locator('.recharge-button')).toBeVisible()
})

test('Recharge button not visible in other user profile', async ({ page }) => {
  await pageLoginAdmin(page)
  await page.goto('/profile/user')

  // Show UserName Firstly
  await expect(page.locator('.profile-username')).toBeVisible()
  await expect(page.locator('.recharge-button')).not.toBeVisible()
})

test('Recharge one time adds 1000 coins', async ({ page }) => {
  await pageRegisterUser(page, 'recharge_test_1')
  await page.goto('/profile/recharge_test_1')

  // New User Have 1000 initially
  await expect(page.locator('.profile-coin')).toContainText('1000')

  // Click recharge button
  await page.locator('.recharge-button').click()

  // Coin in Frontend increased by 1000
  await expect(page.locator('.profile-coin')).toContainText('2000')

  // Coin in Database increased by 1000
  const userInfo = await pageGetCurrentUserInfo(page)
  expect(userInfo.coin).toBe(2000)
})

test('Parallel Recharge for 10 times', async ({ page, context }) => {
  await pageRegisterUser(page, 'recharge_test_2')
  await page.goto('/profile/recharge_test_2')

  // New User Have 1000 initially
  await expect(page.locator('.profile-coin')).toContainText('1000')

  const recharge_times = 10

  await Promise.all(
    [...Array(recharge_times).fill(0)].map(async () => {
      const newPage = await context.newPage()
      await newPage.goto('/profile/recharge_test_2')
      await newPage.locator('.recharge-button').click()
    })
  )

  // Coin in Frontend increased by 1000 * 10
  await page.waitForTimeout(2000)
  await page.reload()
  await expect(page.locator('.profile-coin')).toContainText('11000')

  // Coin in Database increased by 1000 * 100
  const userInfo = await pageGetCurrentUserInfo(page)
  expect(userInfo.coin).toBe(11000)
})
