const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const fs = require('fs')

test('common/config.less', async ({ page }) => {
  const src = process.env['EVAL_PROJECT_ROOT'] || path.join(__dirname, '../src')
  const configPath = path.join(src, 'common/config.less')
  await expect(fs.existsSync(configPath)).toBeTruthy()
  const configLess = fs.readFileSync(configPath).toString()
  await expect(configLess.includes('@color')).toBeTruthy()
  await expect(configLess.includes('{')).toBeTruthy()
})

test('edit question title', async ({ page }) => {
  await page.goto('/design.html')
  await expect(page.locator('.add-question')).toBeVisible()
  await page.locator('.add-question').click()
  const title = page.locator('.q-title')
  await title.click()
  await expect(title).toHaveAttribute('contenteditable', 'true')
  const text = `${new Date().getTime()}`
  await title.fill(text)
  await expect(title).toHaveText(text)
})

test('question config', async ({ page }) => {
  await page.goto('/design.html')
  await expect(page.locator('.q-config')).toBeHidden()
  await page.locator('.add-question').click()
  await expect(page.locator('.q-config')).toBeVisible()
})

test('remove question', async ({ page }) => {
  await page.goto('/design.html')
  await page.locator('.add-question').click()
  await expect(page.locator('.q')).toHaveCount(1)
  await page.locator('.q-remove').click()
  await expect(page.locator('.q')).toHaveCount(0)
})
