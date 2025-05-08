import { test, expect } from '@playwright/test'
import { isExisted, getViewport } from '@web-bench/test-util'
import { configs, data } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('configs', async ({ page }) => {
  await expect(configs).toBeDefined()
  await expect(Object.keys(configs).length).toBeGreaterThan(1)
  await expect(Object.values(configs).filter((c) => c.type === 'line').length).toBeGreaterThan(1)
})

test('data', async ({ page }) => {
  await expect(data).toBeDefined()
  const len = 5
  await expect(data.labels.length).toBe(len)
  await expect(data.datasets.length).toBe(3)
  await expect(data.datasets[0].label).toBeDefined()
  await expect(data.datasets[0].data.length).toBe(len)
})
