import { expect, test } from 'vitest'
import { toCamelCase } from './word'

test('将 aaa-bbb 格式转为大驼峰', () => {
  expect(toCamelCase('calculator')).toBe('Calculator')
  expect(toCamelCase('calculator-files')).toBe('CalculatorFiles')
})
