import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'node:path'
import fs from 'node:fs'

const srcPath = path.join(import.meta.dirname, '../src')
const root = process.env['EVAL_PROJECT_ROOT'] || srcPath
const nodejsPath = path.join(root, 'nodejs/index.js')
const nodejs = await import(nodejsPath)

test('inline data json', async ({ page }) => {
  await expect(nodejs.inlineData).toEqual({ inline: true })
})

test('data url', async ({ page }) => {
  const content = fs.readFileSync(nodejsPath).toString()
  console.log(content)
  await expect(content.includes('data:application/json')).toBeTruthy()
})
