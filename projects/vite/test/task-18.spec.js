const { test, expect } = require('@playwright/test')

test(`frontmatter should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.getByText('hello frontmatter')).toBeVisible()
  await expect(page.getByText('tags')).not.toBeVisible()
})