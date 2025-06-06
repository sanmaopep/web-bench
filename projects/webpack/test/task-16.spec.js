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

const { test, expect } = require('@playwright/test')
const path = require('node:path')
const fs = require('node:fs/promises')
const { globSync } = require('tinyglobby')

const cwd = process.env.EVAL_PROJECT_ROOT

test(`png file in output directory should be compressed`, async ({ page }) => {
  const srcPngFiles = globSync(['src/**/*.png'], {
    cwd,
    absolute: true,
  })

  const distPngFiles = globSync(['dist/**/*.png'], {
    cwd,
    absolute: true,
  })

  const distPngSize = (await fs.readFile(distPngFiles[0])).buffer.byteLength
  const originalPngSize = (await fs.readFile(srcPngFiles[0])).buffer.byteLength

  expect(
    distPngSize
  ).toBeLessThan(
    originalPngSize / 2
  )
})