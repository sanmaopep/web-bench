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