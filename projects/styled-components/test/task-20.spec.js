const { test, expect } = require('@playwright/test')
const { getBackgroundHexColor, submitBlog } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  const header = page.locator('.site-header')
  const button = header.locator('button:has-text("Theme")')
  await button.click()
})

const testCases = [
  {
    title: 'Simple Theme',
    primary: '#ff0000',
    secondary: '#00ff00',
    danger: '#0000ff',
    toast: '#ffff00',
  },
  {
    title: 'Green Theme',
    primary: '#00ff00',
    secondary: '#00dd00',
    danger: '#00aa00',
    toast: '#009900',
  },
]

for (const testCase of testCases) {
  test(`Check Button Theme Changed: ${testCase.title}`, async ({ page }) => {
    await page.locator('input.button-primary').fill(testCase.primary)
    await page.locator('input.button-secondary').fill(testCase.secondary)
    await page.locator('input.button-danger').fill(testCase.danger)

    expect(await getBackgroundHexColor(page.locator('button:has-text("Add Blog")'))).toBe(
      testCase.primary
    )
    expect(await getBackgroundHexColor(page.locator('button:has-text("Read Blogs")'))).toBe(
      testCase.secondary
    )
    expect(await getBackgroundHexColor(page.locator('button:has-text("Theme")'))).toBe(
      testCase.danger
    )
  })

  test(`Check Toast Theme Changed: ${testCase.title}`, async ({ page }) => {
    await page.locator('input.toast-background').fill(testCase.toast)
    await submitBlog(page, { title: 'Test', content: 'Test' })
    expect(await getBackgroundHexColor(page.locator('.toast'))).toBe(testCase.toast)
  })
}
