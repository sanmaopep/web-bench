const { test, expect } = require('@playwright/test')

const pos = (page, x, y) => {
  return page.locator(`.chess-pos-${x}-${y}`)
}

const drop = async (page, x, y) => {
  await pos(page, x, y).click()
}

test.setTimeout(5000)

test.beforeEach(async ({ page }) => {
  await page.goto('/game')
})

test('Save Chess Record', async ({ page }) => {
  await drop(page, 0, 0)
  await drop(page, 1, 0)
  await drop(page, 0, 1)
  await drop(page, 1, 1)
  await drop(page, 0, 2)
  await drop(page, 1, 2)
  await drop(page, 0, 3)
  await drop(page, 1, 3)
  await drop(page, 0, 4)

  await page.getByText('Post Game Records').click()

  // Jump back
  await expect(page).toHaveURL('/')

  await expect(page.locator('h1:has-text("Black is Winner!")')).toBeVisible()
  await expect(page.getByText('Black(0,0);')).toBeVisible()
  await expect(page.getByText('White(1,0);')).toBeVisible()
  await expect(page.getByText('Black(0,1);')).toBeVisible()
  await expect(page.getByText('White(1,1);')).toBeVisible()
  await expect(page.getByText('Black(0,2);')).toBeVisible()
  await expect(page.getByText('White(1,2);')).toBeVisible()
  await expect(page.getByText('Black(0,3);')).toBeVisible()
  await expect(page.getByText('White(1,3);')).toBeVisible()
  await expect(page.getByText('Black(0,4);')).toBeVisible()
})
