const { test, expect } = require('@playwright/test')
const { loginUser, logoutUser } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('User can successfully login with valid credentials', async ({ page }) => {
  // Navigate to login page and login with valid credentials
  await loginUser(page)

  // Verify username is displayed in the header
  await expect(page.locator('.username')).toBeVisible()
  await expect(page.locator('.username')).toContainText('user1')

  // Verify logout button is visible
  await expect(page.locator('.logout-btn')).toBeVisible()
})

test('Login fails with invalid credentials', async ({ page }) => {
  // Navigate to login page
  await page.locator('button:has-text("🔑")').click()

  // Fill login form with invalid credentials
  await page.getByLabel('username').fill('wronguser')
  await page.getByLabel('password').fill('wrongpass')
  await page.locator('.login-submit-btn').click()

  // Verify we are still on login page (not redirected to home)
  await expect(page.locator('h1:text("User Login")')).toBeVisible()

  // Verify username is not displayed in header
  await expect(page.locator('.username')).not.toBeVisible()
})

test('User can logout after login', async ({ page }) => {
  // First login
  await loginUser(page)

  // Verify login was successful
  await expect(page.locator('.username')).toBeVisible()

  // Logout
  await logoutUser(page)

  // Verify username is no longer visible in header
  await expect(page.locator('.username')).not.toBeVisible()

  // Verify login button is visible again
  await expect(page.locator('button:has-text("🔑")')).toBeVisible()
})

test('Blog shows author username when created by logged-in user', async ({ page }) => {
  // First login
  await loginUser(page)

  // Create a new blog
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('Author Test Blog')
  await page.getByLabel('detail').fill('This blog should show an author')
  await page.locator('.submit-btn').click()

  // Select the created blog
  await page.locator('.list-item:has-text("Author Test Blog")').click()

  // Verify author username is displayed
  await expect(page.locator('.blog-author')).toBeVisible()
  await expect(page.locator('.blog-author')).toContainText('user1')
})

test('Blog shows Anonymous when created by Anonymous user', async ({ page }) => {
  // No Login

  // Create a new blog
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('Anonymous Test Blog')
  await page.getByLabel('detail').fill('This blog should show an author')
  await page.locator('.submit-btn').click()

  // Select the created blog
  await page.locator('.list-item:has-text("Anonymous Test Blog")').click()

  // Verify author username is displayed
  await expect(page.locator('.blog-author')).toBeVisible()
  await expect(page.locator('.blog-author')).toContainText('Anonymous')
})

test('Different users can create blogs with their own username', async ({ page }) => {
  // Login as user1
  await loginUser(page, 'user1')

  // Create blog as user1
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('User1 Blog')
  await page.getByLabel('detail').fill('Blog by user1')
  await page.locator('.submit-btn').click()

  // Logout
  await logoutUser(page)

  // Login as user2
  await loginUser(page, 'user2')

  // Create blog as user2
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('User2 Blog')
  await page.getByLabel('detail').fill('Blog by user2')
  await page.locator('.submit-btn').click()

  // Verify user2's blog shows correct author
  await page.locator('.list-item:has-text("User2 Blog")').click()
  await expect(page.locator('.blog-author')).toContainText('user2')

  // Verify user1's blog maintains correct author
  await page.locator('.list-item:has-text("User1 Blog")').click()
  await expect(page.locator('.blog-author')).toContainText('user1')
})

test('Only the author can see edit and delete buttons for their blog', async ({ page }) => {
  // Login as user1
  await loginUser(page, 'user1')
  // Create blog as user1
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('User1 Blog')
  await page.getByLabel('detail').fill('Blog by user1')
  await page.locator('.submit-btn').click()
  // Verify user1 can see edit and delete buttons
  await page.locator('.list-item:has-text("User1 Blog")').click()
  await expect(page.locator('.edit-btn')).toBeVisible()
  await expect(page.locator('.delete-btn')).toBeVisible()
  // Logout
  await logoutUser(page)
  // Login as user2
  await loginUser(page, 'user2')
  // View user1's blog
  await page.locator('.list-item:has-text("User1 Blog")').click()
  // Verify user2 cannot see edit and delete buttons for user1's blog
  await expect(page.locator('.edit-btn')).not.toBeVisible()
  await expect(page.locator('.delete-btn')).not.toBeVisible()
  // Create a blog as user2
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('User2 Blog')
  await page.getByLabel('detail').fill('Blog by user2')
  await page.locator('.submit-btn').click()
  // Verify user2 can see edit and delete buttons for their own blog
  await page.locator('.list-item:has-text("User2 Blog")').click()
  await expect(page.locator('.edit-btn')).toBeVisible()
  await expect(page.locator('.delete-btn')).toBeVisible()
})
