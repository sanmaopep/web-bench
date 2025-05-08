const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('line before form', async ({ page }) => {
  const before = await page.evaluate(() => {
    const element = document.querySelector('#form')
    // @ts-ignore
    const style = window.getComputedStyle(element, '::before')
    return {
      content: style.getPropertyValue('content'),
      height: style.getPropertyValue('height'),
    }
  })

  await expect(before.content.trim()).not.toEqual('')
  await expect(parseInt(before.height)).toEqual(1)
})

test('line after form', async ({ page }) => {
  const before = await page.evaluate(() => {
    const element = document.querySelector('#form')
    // @ts-ignore
    const style = window.getComputedStyle(element, '::after')
    return {
      content: style.getPropertyValue('content'),
      height: style.getPropertyValue('height'),
    }
  })

  await expect(before.content.trim()).not.toEqual('')
  await expect(parseInt(before.height)).toEqual(1)
})

test('no content', async ({ page }) => {
  const before = await page.evaluate(() => {
    const element = document.querySelector('#id10')
    // @ts-ignore
    const style = window.getComputedStyle(element, '::before')
    return {
      content: style.getPropertyValue('content'),
    }
  })

  await expect(before.content.trim()).toEqual('"><"')
})
