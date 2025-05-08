const { isExisted, getComputedStyleByLocator, parseColorToHex } = require('@web-bench/test-util')
const { expect } = require('@playwright/test')
const path = require('path')
const { readFileSync } = require('fs')

const checkExists = (filePath) => {
  expect(isExisted(filePath, path.join(__dirname, '../../src'))).toBeTruthy()
}

const checkFileHasContent = (relativePath, content) => {
  checkExists(relativePath)

  const dirPath = process.env['EVAL_PROJECT_ROOT'] || path.join(__dirname, '../../src')
  const filePath = path.join(dirPath, relativePath)

  const fileContent = readFileSync(filePath, 'utf-8')
  expect(fileContent).toContain(content)
}

const submitBlog = async (page, blog) => {
  const header = page.locator('.site-header')
  const button = header.locator(`button:has-text("Add Blog")`)
  await button.click()

  await page.getByPlaceholder('Title').fill(blog.title)
  await page.getByPlaceholder('Content').fill(blog.content)
  await page.locator('.submit-btn').click()
}

const getBackgroundHexColor = async (locator) => {
  const style = await getComputedStyleByLocator(locator)

  return parseColorToHex(style.backgroundColor)
}

const getTextHexColor = async (locator) => {
  const style = await getComputedStyleByLocator(locator)

  return parseColorToHex(style.color)
}

module.exports = {
  checkExists,
  checkFileHasContent,
  submitBlog,
  getBackgroundHexColor,
  getTextHexColor,
}
