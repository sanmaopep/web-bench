const { test, expect } = require('@playwright/test')
const {
  isExisted,
  getOffsetByLocator,
  getComputedStyleByLocator,
} = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/RankingQuestion.js', async ({ page }) => {
  await expect(isExisted('common/RankingQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('ranking1', async ({ page }) => {
  await expect(page.locator('#ranking1 .ranking-item')).toHaveCount(3)
  await expect(page.locator('#ranking1 *[name="ranking1"]')).toHaveValue('0,1,2')
})

test('ranking1 submit default', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('ranking1')).toBe('0,1,2')
  })

  await submit(page)
})

test('ranking1 submit moved options - drag top', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('ranking1')).toBe('1,0,2')
  })

  const item1 = page.locator('#ranking1 .ranking-item:nth-child(1)')
  const item2 = page.locator('#ranking1 .ranking-item:nth-child(2)')
  const offset1 = await getOffsetByLocator(item1)

  await item2.hover() // scroll to it
  await page.mouse.down()
  await item1.hover({ position: { x: offset1.width / 2, y: 0 } })
  await page.mouse.up()
  await submit(page)
})

test('ranking1 submit moved options - drag bottom', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('ranking1')).toBe('1,0,2')
  })

  const item1 = page.locator('#ranking1 .ranking-item:nth-child(1)')
  const item2 = page.locator('#ranking1 .ranking-item:nth-child(2)')

  await item2.hover() // force to scroll

  await item1.hover() // scroll to it
  await page.mouse.down()
  const offset2 = await getOffsetByLocator(item2)
  const position = { x: offset2.width / 2, y: offset2.height / 2 + 1 }
  await item2.hover({ position })
  await page.mouse.up()
  await submit(page)
})

test('ranking1 submit moved options 2', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('ranking1')).toBe('0,1,2')
  })

  const item1 = page.locator('#ranking1 .ranking-item:nth-child(1)')
  const item2 = page.locator('#ranking1 .ranking-item:nth-child(2)')

  let offset1 = await getOffsetByLocator(item1)
  await item2.hover() // scroll
  await page.mouse.down()
  await item1.hover({ position: { x: offset1.width / 2, y: 0 } })
  await page.mouse.up()

  offset1 = await getOffsetByLocator(item1)
  await item2.hover()
  await page.mouse.down()
  await item1.hover({ position: { x: offset1.width / 2, y: 0 } })
  await page.mouse.up()

  await submit(page)
})

test('ranking1 submit moved options 3', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('ranking1')).toBe('2,1,0')
  })

  const item1 = page.locator('#ranking1 .ranking-item:nth-child(1)')
  const item2 = page.locator('#ranking1 .ranking-item:nth-child(2)')
  const item3 = page.locator('#ranking1 .ranking-item:nth-child(3)')
  let offset1 = await getOffsetByLocator(item1)

  await item3.hover() // scroll
  await page.mouse.down()
  await item1.hover({ position: { x: offset1.width / 2, y: 0 } })
  await page.mouse.up()

  let offset2 = await getOffsetByLocator(item2)
  await item3.hover() // scroll
  await page.mouse.down()
  await item2.hover({ position: { x: offset2.width / 2, y: 0 } })
  await page.mouse.up()

  await submit(page)
})
