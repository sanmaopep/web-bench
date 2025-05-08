import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'path'

const srcPath = path.join(import.meta.dirname, '../src')
const root = process.env['EVAL_PROJECT_ROOT'] || srcPath
const nodejs = await import(path.join(root, 'nodejs/index.js'))

test('nodejs/data.json', async ({ page }) => {
  await expect(isExisted('nodejs/data.json', srcPath)).toBeTruthy()
})

test('import data.json', async ({ page }) => {
  await expect(nodejs.data).toEqual({ version: 1 })
})
