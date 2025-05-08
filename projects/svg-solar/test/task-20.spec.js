const { test, expect } = require('@playwright/test')
const {
  expectTolerance,
  getOffsetByLocator,
  getComputedStyleByLocator,
} = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('comet button', async ({ page }) => {
  await expect(page.locator('button#comet')).toBeVisible()
  await expect(page.locator('#comet:disabled')).not.toBeVisible()
})

test('comet button | planet-satellites', async ({ page }) => {
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  await expect(page.locator('#comet:disabled')).toBeVisible()
})

test('click comet', async ({ page }) => {
  const name = 'comet1'
  page.on('dialog', (dialog) => {
    if (dialog.type() === 'prompt') {
      dialog.accept(name)
    }
  })

  await expect(page.locator('.comet')).not.toBeVisible()
  await page.locator('#comet').click()
  await expect(page.locator('.comet')).toBeVisible()

  const orbit = page.locator(`#orbit_${name}`)
  await expect(orbit).toBeVisible()
  const offset = await getOffsetByLocator(orbit)
  const rx = offset.width / density / 2
  const ry = offset.height / density / 2
  // const dur = parseFloat((await page.locator(`.comet animateMotion`).getAttribute('dur')) ?? '0')
  // console.log({ rx, ry })

  await expect(rx >= 60 && rx <= 80).toBeTruthy()
  await expect(ry >= 2 && ry <= 4).toBeTruthy()
  // await expect(dur >= 200 && dur <= 400).toBeTruthy()
})
