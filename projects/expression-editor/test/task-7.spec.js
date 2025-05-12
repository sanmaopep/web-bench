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
const { describe, test, expect } = require('@playwright/test')

function tokenizeFormula(source) {
  const { tokenize } = require(path.join(process.env.EVAL_PROJECT_ROOT, 'parser.js'))
  return tokenize(source)
}

describe('tokenize', () => {
  test('Empty', () => {
    expect(tokenizeFormula(``)).toEqual([])
  })

  test('foo AND bar', () => {
    const source = `foo AND bar`
    expect(tokenizeFormula(source)).toEqual([
      expect.objectContaining({
        "type": "identifier",
        "from": 0,
        "to": 3,
        "value": "foo"
      }),
      expect.objectContaining({
        "type": "operator",
        "from": 4,
        "to": 7,
        "value": "AND"
      }),
      expect.objectContaining({
        "type": "identifier",
        "from": 8,
        "to": 11,
        "value": "bar"
      })
    ])
  })

  test('foo OR bar', () => {
    const source = `foo OR bar`
    expect(tokenizeFormula(source)).toEqual([
      expect.objectContaining({
        "type": "identifier",
        "from": 0,
        "to": 3,
        "value": "foo"
      }),
      expect.objectContaining({
        "type": "operator",
        "from": 4,
        "to": 6,
        "value": "OR"
      }),
      expect.objectContaining({
        "type": "identifier",
        "from": 7,
        "to": 10,
        "value": "bar"
      })
    ])
  })

  test('foo AND (bar AND baz)', () => {
    const source = `foo AND (bar AND baz)`
    expect(tokenizeFormula(source)).toEqual([
      expect.objectContaining({
        "type": "identifier",
        "from": 0,
        "to": 3,
        "value": "foo"
      }),
      expect.objectContaining({
        "type": "operator",
        "from": 4,
        "to": 7,
        "value": "AND"
      }),
      expect.objectContaining({
        "type": "lparen",
        "from": 8,
        "to": 9
      }),
      expect.objectContaining({
        "type": "identifier",
        "from": 9,
        "to": 12,
        "value": "bar"
      }),
      expect.objectContaining({
        "type": "operator",
        "from": 13,
        "to": 16,
        "value": "AND"
      }),
      expect.objectContaining({
        "type": "identifier",
        "from": 17,
        "to": 20,
        "value": "baz"
      }),
      expect.objectContaining({
        "type": "rparen",
        "from": 20,
        "to": 21
      })
    ])
  })

  test('   foo   AND (  bar    AND    baz )  ', () => {
    const source = `   foo   AND (  bar    AND    baz )  `
    expect(tokenizeFormula(source)).toEqual([
      expect.objectContaining({
        "type": "identifier",
        "from": 3,
        "to": 6,
        "value": "foo"
      }),
      expect.objectContaining({
        "type": "operator",
        "from": 9,
        "to": 12,
        "value": "AND"
      }),
      expect.objectContaining({
        "type": "lparen",
        "from": 13,
        "to": 14
      }),
      expect.objectContaining({
        "type": "identifier",
        "from": 16,
        "to": 19,
        "value": "bar"
      }),
      expect.objectContaining({
        "type": "operator",
        "from": 23,
        "to": 26,
        "value": "AND"
      }),
      expect.objectContaining({
        "type": "identifier",
        "from": 30,
        "to": 33,
        "value": "baz"
      }),
      expect.objectContaining({
        "type": "rparen",
        "from": 34,
        "to": 35
      })
    ])
  })
})