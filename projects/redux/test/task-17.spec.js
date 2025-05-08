const { test, expect } = require('@playwright/test')

const { posWhite, posBlack, drop, performUndo } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/game')
})

test('Game is automatically recorded and can be replayed after completion', async ({ page }) => {
  // Play a complete game
  await drop(page, 7, 7) // Black
  await drop(page, 8, 8) // White
  await drop(page, 7, 8) // Black
  await drop(page, 8, 7) // White
  await drop(page, 7, 6) // Black
  await drop(page, 8, 6) // White
  await drop(page, 7, 9) // Black
  await drop(page, 8, 9) // White
  await drop(page, 7, 5) // Black wins with 5 in a row

  // After game ends, replay controls should be visible
  await page.locator('.replay-play-btn').click()
  await expect(page.locator('.replay-slider')).toBeVisible()
  await expect(page.locator('.current-move')).toBeVisible()

  // Initially should show move 0
  await expect(page.locator('.current-move')).toContainText('0')
})

test('When undo in a finished game, replay button should disappear', async ({
  page,
  browserName,
}) => {
  // Play a complete game
  await drop(page, 7, 7) // Black
  await drop(page, 8, 8) // White
  await drop(page, 7, 8) // Black
  await drop(page, 8, 7) // White
  await drop(page, 7, 6) // Black
  await drop(page, 8, 6) // White
  await drop(page, 7, 9) // Black
  await drop(page, 8, 9) // White
  await drop(page, 7, 5) // Black wins with 5 in a row

  // After game ends, replay controls should be visible
  await expect(page.locator('.replay-play-btn')).toBeVisible()

  // Perform undo
  await performUndo(page, browserName)

  // When undo a finished game, replay button disappears
  await expect(page.locator('.replay-play-btn')).not.toBeVisible()
})

test('Replay functionality works with play/pause and slider', async ({ page }) => {
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

  // Play the replay
  await page.locator('.replay-play-btn').click()

  // Wait for first move to appear (1000ms interval)
  await page.waitForTimeout(1000)
  await expect(posBlack(page, 1, 1)).toBeVisible()
  await expect(page.locator('.current-move')).toContainText('1')

  // Wait for second move
  await page.waitForTimeout(1000)
  await expect(posWhite(page, 2, 1)).toBeVisible()
  await expect(page.locator('.current-move')).toContainText('2')

  // Pause the replay
  await page.locator('.replay-pause-btn').click()

  // Use slider to go back to first move
  await page.locator('.replay-slider').fill('1')

  // Should now show move 1 and only first piece should be visible
  await expect(page.locator('.current-move')).toContainText('1')
  await expect(posBlack(page, 1, 1)).toBeVisible()
  await expect(posWhite(page, 2, 1)).not.toBeVisible()
})
