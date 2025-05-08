const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Markdown grammar: "#" -> h1, "##" -> h2, "###" -> h3', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('Markdown')
  await page.getByLabel('detail').fill('# MarkdownH1\n## MarkdownH2\n### MarkdownH3')
  await page.locator('.submit-btn').click()

  await expect(page.locator('h1:text("MarkdownH1")')).toBeVisible()
  await expect(page.locator('h2:text("MarkdownH2")')).toBeVisible()
  await expect(page.locator('h3:text("MarkdownH3")')).toBeVisible()
})

test('Check XSS protection', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('XSS')
  await page.getByLabel('detail').fill('<script>document.body.innerHTML = ""</script>')
  await page.locator('.submit-btn').click()

  // XSS injection will not break the page
  await expect(page.getByText('Hello Blog')).toBeVisible()
})
