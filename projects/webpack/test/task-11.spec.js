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
const fs = require('node:fs')
const { globSync } = require('tinyglobby')

const cwd = process.env.EVAL_PROJECT_ROOT

test(`*.map should be moved to sourcemaps`, async ({ page }) => {
  const distMaps = globSync(
    ['dist/**/*.map'],
    {
      cwd,
    }
  )
  expect(distMaps.length).toBe(0)

  const movedMaps = globSync(
    ['sourcemaps/**/*.map'],
    {
      cwd,
    }
  )
  expect(movedMaps.length).toBeGreaterThan(0)

  const files = globSync(
    ['dist/**/*.js'],
    {
      cwd,
      absolute: true,
    }
  )
  expect(
    files.every(file => {
      return fs.readFileSync(file, 'utf8')
        .includes(`https://internal.com/sourcemaps/${path.relative(path.join(cwd, 'dist'), file)}.map`)
    })
  ).toBe(true)
})