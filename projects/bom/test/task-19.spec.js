import { test, devices, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

async function isInFullscreen(page) {
  return page.evaluate(() => document.fullscreenElement?.classList.contains('content'))
}

test('.fullscreen', async ({ page }) => {
  await expect(await page.evaluate(() => document.fullscreenEnabled)).toBeTruthy()
  await expect(page.locator('.fullscreen')).toBeVisible()
})

test('click .fullscreen', async ({ page }) => {
  await page.locator('.fullscreen').click()
  expect(await isInFullscreen(page)).toBeTruthy()
})

test('exit .fullscreen', async ({ page }) => {
  await page.locator('.fullscreen').click()
  expect(await isInFullscreen(page)).toBeTruthy()
  await page.evaluate(() => document.exitFullscreen())
  expect(await isInFullscreen(page)).toBeFalsy()

  // await page.locator('.fullscreen').click()
  // expect(await isInFullscreen(page)).toBeTruthy()
  // const contentFrame = page.frame('content')
  // await contentFrame?.page().keyboard.press('Escape')
  // await page.keyboard.press('Escape')
  // expect(await isInFullscreen(page)).toBeFalsy()
})

test('click .exit-fullscreen', async ({ page }) => {
  await page.locator('.fullscreen').click()
  expect(await isInFullscreen(page)).toBeTruthy()

  const contentFrame = page.frame('content')
  await contentFrame?.locator('.exit-fullscreen').click()
  expect(await isInFullscreen(page)).toBeFalsy()
})
