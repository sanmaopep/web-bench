const { test, expect } = require('@playwright/test')
const { performUndo, drop, posWhite, posBlack } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/game')
})

test('Single undo removes the last move', async ({ page }) => {
  // Make a move with black piece
  await drop(page, 7, 7)
  await expect(page.getByText("White's Turn")).toBeVisible()

  // Make a move with white piece
  await drop(page, 8, 8)
  await expect(page.getByText("Black's Turn")).toBeVisible()

  // undo to remove white's move
  await performUndo(page)

  // Should now be white's turn again
  await expect(page.getByText("White's Turn")).toBeVisible()

  // White piece should be gone from the board
  await expect(posWhite(page, 8, 8)).not.toBeVisible()

  // Black piece should still be on the board
  await expect(posBlack(page, 7, 7)).toBeVisible()
})

test('Multiple consecutive undos revert to earlier game states', async ({ page }) => {
  // Make several moves
  await drop(page, 7, 7) // Black
  await drop(page, 8, 8) // White
  await drop(page, 7, 8) // Black

  // Undo twice
  await performUndo(page)
  await performUndo(page)

  // Should now be white's turn
  await expect(page.getByText("White's Turn")).toBeVisible()

  // Only first black piece should remain
  await expect(posBlack(page, 7, 7)).toBeVisible()
  await expect(posWhite(page, 8, 8)).not.toBeVisible()
  await expect(posBlack(page, 7, 8)).not.toBeVisible()
})

test('Keyboard shortcut triggers undo action', async ({ page, browserName }) => {
  // Make a move
  await drop(page, 7, 7)

  // Use keyboard shortcut to undo
  await performUndo(page, browserName)

  // Board should be empty
  await expect(page.locator('.chess-black')).not.toBeVisible()
  await expect(page.getByText("Black's Turn")).toBeVisible()
})

test('Move history is displayed and updated correctly', async ({ page }) => {
  // Initially history should be empty
  await expect(page.locator('.move-history')).toBeVisible()

  // Make moves and check history
  await drop(page, 3, 4)
  await expect(page.locator('.history-item').first()).toContainText('Black: (3,4)')

  await drop(page, 5, 6)
  await expect(page.locator('.history-item').nth(1)).toContainText('White: (5,6)')

  // Undo and check that history is updated
  await performUndo(page)
  await expect(page.locator('.history-item').nth(1)).not.toBeVisible()
})
