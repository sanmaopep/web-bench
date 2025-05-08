
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