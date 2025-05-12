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
const path = require('path')

function evaluateFormula(source) {
  const { evaluate } = require(path.join(process.env.EVAL_PROJECT_ROOT, 'evaluate.js'))
  return evaluate(source)
}

test('foo and bar = null', () => {
  expect(evaluateFormula(`foo and bar`)).toEqual(null)
})

test('foo A = null', () => {
  expect(evaluateFormula(`foo A`)).toEqual(null)
})

test('foo AND bar = true', () => {
  expect(evaluateFormula(`foo AND bar`)).toEqual(true)
})

test('foo AND (bar OR barrrr) = true', () => {
  expect(evaluateFormula(`foo AND (bar OR barrrr)`)).toEqual(true)
})