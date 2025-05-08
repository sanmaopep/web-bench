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