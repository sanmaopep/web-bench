const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

const delay = 10

test(`"foo an" shall report Syntax Error`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo an', {
    delay,
  })

  await expect(page.getByText('Syntax Error')).toBeVisible()
})

test(`"foo AND bar a" shall report Syntax Error`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo AND bar a', {
    delay,
  })

  await expect(page.getByText('Syntax Error')).toBeVisible()
})

test(`"(foo AND bar" shall report Syntax Error`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('(foo AND bar', {
    delay,
  })

  await expect(page.getByText('Syntax Error')).toBeVisible()
})

test(`"foo and bar" shall not report Syntax Error`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo and bar', {
    delay,
  })

  await expect(page.getByText('Syntax Error')).not.toBeVisible()
})