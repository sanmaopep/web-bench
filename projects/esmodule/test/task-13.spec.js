import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'path'
import fs from 'fs'

const srcPath = path.join(import.meta.dirname, '../src')
const root = process.env['EVAL_PROJECT_ROOT'] || srcPath

test.beforeEach(async ({ page }) => {
})

test('nodejs/index.js', async ({ page }) => {
  await expect(isExisted('nodejs/index.js', srcPath)).toBeTruthy()
})

test('nodejs/test-config.js', async ({ page }) => {
  await import(path.join(root, 'nodejs/index.js'))
  await expect(isExisted('nodejs/test-config.js', srcPath)).toBeTruthy()
  const mod = await import(path.join(root, 'nodejs/test-config.js'))
  await expect(mod.config).toEqual({ lang: 'en' })
})
