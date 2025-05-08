import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'path'

const srcPath = path.join(import.meta.dirname, '../src')
const root = process.env['EVAL_PROJECT_ROOT'] || srcPath
let nodejs

test.beforeEach(async ({ page }) => {
  nodejs = await import(path.join(root, 'nodejs/index.js'))
  // console.log(nodejs)
  await expect(nodejs).toBeDefined()
})

test('top-level await', async ({ page }) => {
  await expect(nodejs.lang).toBe('en')
})
