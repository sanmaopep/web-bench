import { expect, test } from '@playwright/test'
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { data, getUnionRect, hasUniqueValues } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#datasets').selectOption([{ index: 1 }, { index: 2 }])
})

test('LineChart | #datasets values', async ({ page }) => {
  await expect(page.locator('#datasets')).toHaveValues(['Pass@1', 'Error@1'])

  await page.locator('#datasets').selectOption([{ index: 0 }])
  await expect(page.locator('#datasets')).toHaveValues(['Pass@2'])
})

test('LineChart | select 2 #datasets', async ({ page }) => {
  await expect(page.locator('.chart .dataset')).toHaveCount(2)
})

test('LineChart | select 1 #datasets', async ({ page }) => {
  await page.locator('#datasets').selectOption({ index: 0 })
  await expect(page.locator('.chart .dataset')).toHaveCount(1)
})

test('LineChart | unselect #datasets', async ({ page }) => {
  await page.locator('#datasets').selectOption([])
  await expect(page.locator('.chart .dataset')).toHaveCount(0)
})

