const { test, expect } = require('@playwright/test')
const { loginUser, posWhite, posBlack, drop } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/game')
})

test.describe('Share to Blog Function', () => {
  test.describe.configure({ mode: 'serial' })

  let page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/game')
  })

  test('Share to Blog button exists and opens share modal', async () => {
    await expect(page.locator('.share-to-blog-btn')).not.toBeVisible()

    // Play a quick game
    await drop(page, 1, 1)
    await drop(page, 2, 1)
    await drop(page, 2, 2)
    await drop(page, 3, 2)
    await drop(page, 3, 3)
    await drop(page, 4, 3)
    await drop(page, 4, 4)
    await drop(page, 5, 4)
    await drop(page, 5, 5) // Black wins diagonally

    await expect(page.locator('.share-to-blog-btn')).toBeVisible()
  })

  test('Can share a game as a blog post', async () => {
    // Click the share button
    await page.locator('.share-to-blog-btn').click()

    // Modal should appear with title and description inputs
    await expect(page.locator('.share-modal')).toBeVisible()
    await page.locator('.title-input').fill('My Awesome Gomoku Game')
    await page.locator('.description-input').fill('Check out this game I played!')
    await page.locator('.share-submit').click()

    // Go to home page
    await page.waitForURL('/')
    await expect(page.locator('.list-item:has-text("My Awesome Gomoku Game")')).toBeVisible()
    // Blog content should be visible
    await expect(page.getByText('Check out this game I played!')).toBeVisible()

    // Replay button should be visible
    await expect(page.locator('.blog-replay-btn')).toBeVisible()
  })

  test('Replay game', async () => {
    // Click replay button
    await page.locator('.blog-replay-btn').click()

    // Replay modal should appear
    await expect(page.locator('.blog-replay-modal')).toBeVisible()

    // Controls should be visible
    await expect(page.locator('.blog-replay-start-play')).toBeVisible()

    // Initially should show move 0
    await expect(page.locator('.current-move')).toContainText('0')

    // Play the replay
    await page.locator('.blog-replay-start-play').click()

    // Wait for moves to play
    await page.waitForTimeout(2000)

    // Should now be showing the last move (move 2)
    await expect(page.locator('.current-move')).toContainText('2')

    // Both pieces should be visible
    await expect(posBlack(page, 1, 1)).toBeVisible()
    await expect(posWhite(page, 2, 1)).toBeVisible()
  })
})
