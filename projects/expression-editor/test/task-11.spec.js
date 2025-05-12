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

const path = require('path')
const { test, expect } = require('@playwright/test')

function lintFormula(source) {
  const { parse } = require(path.join(process.env.EVAL_PROJECT_ROOT, 'parser.js'))
  const { lint } = require(path.join(process.env.EVAL_PROJECT_ROOT, 'lint.js'))
  const tree = parse(source)
  return lint(tree)
}

test(`Empty source`, () => {
  const diagnostics = lintFormula(``)
  expect(diagnostics).toHaveLength(0)
})

test(`foo and bar`, () => {
  const diagnostics = lintFormula(`foo and bar`)
  expect(diagnostics).toHaveLength(1)
  expect(diagnostics[0].range).toEqual({
    from: 4,
    to: 7,
  })
})

test(`foo And bar`, () => {
  const diagnostics = lintFormula(`foo And bar`)
  expect(diagnostics).toHaveLength(1)
  expect(diagnostics[0].range).toEqual({
    from: 4,
    to: 7,
  })
})

test(`foo or bar`, () => {
  const diagnostics = lintFormula(`foo or bar`)
  expect(diagnostics).toHaveLength(1)
  expect(diagnostics[0].range).toEqual({
    from: 4,
    to: 6,
  })
})

test(`foo Or bar`, () => {
  const diagnostics = lintFormula(`foo Or bar`)
  expect(diagnostics).toHaveLength(1)
  expect(diagnostics[0].range).toEqual({
    from: 4,
    to: 6,
  })
})

test(`foo And bar Or baz`, () => {
  const diagnostics = lintFormula(`foo And bar Or baz`)
  expect(diagnostics).toHaveLength(2)
  expect(diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        range: {
          from: 4,
          to: 7,
        },
      }),
      expect.objectContaining({
        range: {
          from: 12,
          to: 14,
        },
      }),
    ])
  )
})