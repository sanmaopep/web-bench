import { test, expect } from '@playwright/test'
import path from 'path'
import { isExisted } from '@web-bench/test-util'

const srcPath = path.join(import.meta.dirname, '../src')

test('shape/Shape.js', async ({ page }) => {
  await expect(isExisted('modules/shape/Shape.js', srcPath)).toBeTruthy()
})

test('shape/Circle.js', async ({ page }) => {
  await expect(isExisted('modules/shape/Circle.js', srcPath)).toBeTruthy()
})

test('shape/Rectangle.js', async ({ page }) => {
  await expect(isExisted('modules/shape/Rectangle.js', srcPath)).toBeTruthy()
})
