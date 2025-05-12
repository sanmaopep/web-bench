// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const path = require('node:path')
const { test, expect } = require('@playwright/test')
const { execa } = require('execa')
const fs = require('node:fs')

const cwd = process.env.EVAL_PROJECT_ROOT

test(`dev and build should be added in scripts`, async () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, `package.json`), 'utf8'))
  expect(pkg.scripts.dev).toBeDefined()
  expect(pkg.scripts.build).toBeDefined()
})

test(`build should work`, async () => {
  await execa({ cwd })`npm run build`

  expect(() => {
    fs.readFileSync(path.join(cwd, `dist/index.html`))
  }).not.toThrowError()
})

test(`dev should work`, async ({ page }) => {
  expect(() => {
    fs.readFileSync(path.join(cwd, `dist-serve/index.html`))
  }).not.toThrowError()

  await page.goto(`/index.html`)

  await expect(page.locator('#app')).toBeDefined()
})

test(`expose to LAN`, async ({ page }) => {
  await page.goto(`http://0.0.0.0:${process.env.EVAL_PROJECT_PORT}/index.html`)

  await expect(page.getByText('hello world').first()).toBeVisible()
})