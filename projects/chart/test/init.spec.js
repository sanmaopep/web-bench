import { test, expect } from '@playwright/test'
import { isExisted, getViewport } from '@web-bench/test-util'
import { configs, data, getUnionRect, hasUniqueValues } from './util/util'
import path from 'path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('files', async ({ page }) => {
  const __dirname = import.meta.dirname
  await expect(isExisted('index.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('assets/data.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('assets/res.svg', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/Chart.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/Chart.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/ChartTheme.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/config.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/LineChart.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/util.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('data', async ({ page }) => {
  await expect(data).toBeDefined()
  const len = 5
  await expect(data.labels.length).toBe(len)
  await expect(data.datasets.length).toBe(3)
  await expect(data.datasets[0].label).toBeDefined()
  await expect(data.datasets[0].data.length).toBe(len)
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('root', async ({ page }) => {
  await expect(page.locator('.root')).toBeAttached()
})

test('#configs', async ({ page }) => {
  await expect(page.locator('#configs')).toBeAttached()
  await expect(page.locator('#type')).toBeAttached()
  await expect(page.locator('#axes')).toBeAttached()
  await expect(page.locator('#grids')).toBeAttached()
  await expect(page.locator('#legends')).toBeAttached()
  await expect(page.locator('#dataLabels')).toBeAttached()
  await expect(page.locator('#pointStyle')).toBeAttached()
  await expect(page.locator('#datasets')).toBeAttached()
})

test('#chart', async ({ page }) => {
  await expect(page.locator('#chart')).toBeAttached()
})
