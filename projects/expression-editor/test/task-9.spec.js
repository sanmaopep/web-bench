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

function parseFormula(source) {
  const { parse } = require(path.join(process.env.EVAL_PROJECT_ROOT, 'parser.js'))
  return parse(source)
}

test(`Empty source`, () => {
  const tree = parseFormula(``)
  expect(tree.range).toEqual({
    from: 0,
    to: 0
  })
})

test(`foo AND bar`, () => {
  const tree = parseFormula(`foo AND bar`)

  expect(tree.range).toEqual({
    "from": 0,
    "to": 11
  })

  expect(tree.body[0].range).toEqual({
    "from": 0,
    "to": 11
  })

  expect(tree.body[0].left.range).toEqual({
    "from": 0,
    "to": 3,
  })

  expect(tree.body[0].right.range).toEqual({
    "from": 8,
    "to": 11,
  })
})