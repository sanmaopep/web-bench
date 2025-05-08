import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'path'

const srcPath = path.join(import.meta.dirname, '../src')
const root = process.env['EVAL_PROJECT_ROOT'] || srcPath
let nodejs

test.beforeEach(async ({ page }) => {
  nodejs = await import(path.join(root, 'nodejs/index.js'))
  await expect(nodejs).toBeDefined()
})

test('nodejs/cjs.cjs', async ({ page }) => {
  await expect(isExisted('nodejs/cjs.cjs', srcPath)).toBeTruthy()
  const mod = await import(path.join(root, 'nodejs/cjs.cjs'))
  await expect(mod.default).toEqual({ cjs: true })
  await expect(mod.cjs).toEqual(true)
})

test('nodejs.cjs', async ({ page }) => {
  await expect(nodejs.cjs).toBe(true)
})
