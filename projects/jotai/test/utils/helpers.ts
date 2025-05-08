/**
 * Helper functions for tests
 */

/**
 * Login with the specified username and password
 * @param page - Playwright page object
 * @param username - Username to login with
 * @param password - Password to login with
 */
export async function loginUser(page, username = 'user1', password = '123456') {
  if (page.url() === "about:blank") {
    await page.goto("/")
  }

  // Navigate to login page
  await page.locator('button:has-text("🔑")').click();
  
  // Fill login form
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.locator('.login-submit-btn').click();
  
  // Wait for login to complete and return to home
  await page.waitForURL('/')
}

/**
 * Logout the current user
 * @param page - Playwright page object
 */
export async function logoutUser(page) {
  await page.locator('.logout-btn').click();
}

/**
 * Perform an undo action using the appropriate keyboard shortcut
 * @param page - Playwright page object
 * @param browserName - The name of the browser being used
 */
export async function performUndo(page, browserName) {
  // Use Meta+z for macOS/webkit, Control+z for Windows/Linux
  if (browserName === 'webkit' || process.platform === 'darwin') {
    await page.keyboard.press('Meta+z');
  } else {
    await page.keyboard.press('Control+z');
  }
}


/**
 * Gamoku Game Related Helpers
 */

export const pos = (page, x, y) => {
  return page.locator(`.chess-pos-${x}-${y}`)
}

export const posWhite = (page, x, y) => {
  return page.locator(`.chess-white.chess-pos-${x}-${y}, .chess-pos-${x}-${y} .chess-white`)
}

export const posBlack = (page, x, y) => {
  return page.locator(`.chess-black.chess-pos-${x}-${y}, .chess-pos-${x}-${y} .chess-black`)
}

export const drop = async (page, x, y) => {
  await pos(page, x, y).click()
}