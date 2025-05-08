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