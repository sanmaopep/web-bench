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

function parseFormula(source) {
  const { parse } = require(path.join(process.env.EVAL_PROJECT_ROOT, 'parser.js'))
  return parse(source)
}

describe('parse', () => {
  test('Empty', async () => {
    expect(parseFormula(``)).toEqual(
      expect.objectContaining({
        "type": "Program",
        "body": []
      })
    )
  })

  test('foo AND bar', async () => {
    expect(parseFormula(`foo AND bar`)).toEqual(
      expect.objectContaining({
        "type": "Program",
        "body": [
          expect.objectContaining({
            "type": "LogicalExpression",
            "operator": "AND",
            "left": expect.objectContaining({
              "type": "Identifier",
              "name": "foo"
            }),
            "right": expect.objectContaining({
              "type": "Identifier",
              "name": "bar"
            })
          })
        ]
      })
    )
  })

  test('foo OR bar', async () => {
    expect(parseFormula(`foo OR bar`)).toEqual(
      expect.objectContaining({
        "type": "Program",
        "body": [
          expect.objectContaining({
            "type": "LogicalExpression",
            "operator": "OR",
            "left": expect.objectContaining({
              "type": "Identifier",
              "name": "foo"
            }),
            "right": expect.objectContaining({
              "type": "Identifier",
              "name": "bar"
            })
          })
        ]
      })
    )
  })

  test('AND operator is left-associative: foo AND bar AND baz', async () => {
    expect(parseFormula(`foo AND bar AND baz`)).toEqual(
      expect.objectContaining({
        "type": "Program",
        "body": [
          expect.objectContaining({
            "type": "LogicalExpression",
            "operator": "AND",
            "left": expect.objectContaining({
              "type": "LogicalExpression", 
              "operator": "AND",
              "left": expect.objectContaining({
                "type": "Identifier",
                "name": "foo"
              }),
              "right": expect.objectContaining({
                "type": "Identifier",
                "name": "bar"
              })
            }),
            "right": expect.objectContaining({
              "type": "Identifier",
              "name": "baz"
            })
          })
        ]
      })
    )
  })

  test('OR operator is left-associative: foo OR bar OR baz', async () => {
    expect(parseFormula(`foo OR bar OR baz`)).toEqual(
      expect.objectContaining({
        "type": "Program",
        "body": [
          expect.objectContaining({
            "type": "LogicalExpression",
            "operator": "OR",
            "left": expect.objectContaining({
              "type": "LogicalExpression",
              "operator": "OR",
              "left": expect.objectContaining({
                "type": "Identifier",
                "name": "foo"
              }),
              "right": expect.objectContaining({
                "type": "Identifier",
                "name": "bar"
              })
            }),
            "right": expect.objectContaining({
              "type": "Identifier",
              "name": "baz"
            })
          })
        ]
      })
    )
  })

  test('AND precedence is higher than OR precedence: foo OR bar AND baz', async () => {
    expect(parseFormula(`foo OR bar AND baz`)).toEqual(
      expect.objectContaining({
        "type": "Program",
        "body": [
          expect.objectContaining({
            "type": "LogicalExpression",
            "operator": "OR",
            "left": expect.objectContaining({
              "type": "Identifier",
              "name": "foo"
            }),
            "right": expect.objectContaining({
              "type": "LogicalExpression",
              "operator": "AND",
              "left": expect.objectContaining({
                "type": "Identifier",
                "name": "bar"
              }),
              "right": expect.objectContaining({
                "type": "Identifier",
                "name": "baz"
              })
            })
          })
        ]
      })
    )
  })

  test('Use Paren to change default associativity: foo AND (bar AND baz)', async () => {
    expect(parseFormula(`foo AND (bar AND baz)`)).toEqual(
      expect.objectContaining({
        "type": "Program",
        "body": [
          expect.objectContaining({
            "type": "LogicalExpression",
            "operator": "AND",
            "left": expect.objectContaining({
              "type": "Identifier",
              "name": "foo"
            }),
            "right": expect.objectContaining({
              "type": "LogicalExpression",
              "operator": "AND",
              "left": expect.objectContaining({
                "type": "Identifier",
                "name": "bar"
              }),
              "right": expect.objectContaining({
                "type": "Identifier",
                "name": "baz"
              })
            })
          })
        ]
      })
    )
  })

  test('Use Paren to change default associativity: (foo OR bar) AND baz', async () => {
    expect(parseFormula(`(foo OR bar) AND baz`)).toEqual(
      expect.objectContaining({
        "type": "Program",
        "body": [
          expect.objectContaining({
            "type": "LogicalExpression",
            "operator": "AND",
            "left": expect.objectContaining({
              "type": "LogicalExpression", 
              "operator": "OR",
              "left": expect.objectContaining({
                "type": "Identifier",
                "name": "foo"
              }),
              "right": expect.objectContaining({
                "type": "Identifier",
                "name": "bar"
              })
            }),
            "right": expect.objectContaining({
              "type": "Identifier",
              "name": "baz"
            })
          })
        ]
      })
    )
  })

  test('Any number of whitespaces should not affect the parse result:   foo   OR     (   bar   OR   baz   )   ', () => {
    expect(parseFormula(`  foo   OR     (   bar   OR   baz   )   `)).toEqual(
      expect.objectContaining({
        "type": "Program",
        "body": [
          expect.objectContaining({
            "type": "LogicalExpression",
            "operator": "OR",
            "left": expect.objectContaining({
              "type": "Identifier",
              "name": "foo"
            }),
            "right": expect.objectContaining({
              "type": "LogicalExpression",
              "operator": "OR",
              "left": expect.objectContaining({
                "type": "Identifier",
                "name": "bar"
              }),
              "right": expect.objectContaining({
                "type": "Identifier",
                "name": "baz"
              })
            })
          })
        ]
      })
    )
  })
})