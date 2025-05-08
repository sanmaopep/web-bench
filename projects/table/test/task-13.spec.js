const { test, expect } = require('@playwright/test')
const { getCmdKey } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('copy/paste selected cell', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  const text = new Date().getTime() + ''
  await td.dblclick()
  await td.clear()
  await td.fill(text)
  await page.keyboard.press('Escape')

  const cmd = getCmdKey()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  await row1.locator('td:nth-child(2)').click()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  await expect(row1.locator('td:nth-child(2)')).toHaveText(text)
})

test('copy/paste editing cell', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  const text = new Date().getTime() + ''
  await td.dblclick()
  await td.clear()
  await td.fill(text)

  const cmd = getCmdKey()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  await row1.locator('td:nth-child(2)').click()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  await expect(row1.locator('td:nth-child(2)')).not.toHaveText(text)
})
