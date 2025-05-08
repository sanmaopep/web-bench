const { test, expect } = require('@playwright/test')
const { getCmdKey } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('copy/paste cells, same sizes', async ({ page }) => {
  const cmd = getCmdKey()
  // copy 2x2
  await page.locator('.table thead tr:nth-child(1) th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(1) td:nth-child(2)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  // extend table
  await page.locator('.table thead tr:nth-child(1) th:nth-child(3)').click({ button: 'right' })
  await page.locator('.menu-item-insert-col-right').click()
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').click({ button: 'right' })
  await page.locator('.menu-item-insert-row-below').click()

  // paste 2x2
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(3) td:nth-child(4)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  // assertion
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(4)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(4)').textContent()) ?? ''
  )
})

test('copy/paste cells, different sizes', async ({ page }) => {
  const cmd = getCmdKey()
  // copy 2x2
  await page.locator('.table thead tr:nth-child(1) th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(1) td:nth-child(2)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  // paste 1x1
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').click()
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  // assertion
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(4)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(4)').textContent()) ?? ''
  )
})

test('copy/paste cells, different sizes 2', async ({ page }) => {
  const cmd = getCmdKey()
  // copy 2x2
  await page.locator('.table thead tr:nth-child(1) th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(1) td:nth-child(2)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyC')
  await page.keyboard.up(cmd)

  // paste 1x1
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(2)').click()
  await page.keyboard.down('Shift')
  await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').click()
  await page.keyboard.up('Shift')
  await page.keyboard.down(cmd)
  await page.keyboard.press('KeyV')
  await page.keyboard.up(cmd)

  // assertion
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(2)').textContent()) ?? ''
  )
  await expect(page.locator('.table thead tr:nth-child(1) th:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(2) td:nth-child(3)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(2)').textContent()) ?? ''
  )
  await expect(page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')).toHaveText(
    (await page.locator('.table tbody tr:nth-child(3) td:nth-child(3)').textContent()) ?? ''
  )
})
