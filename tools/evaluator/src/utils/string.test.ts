import { expect, test } from 'vitest'
import { filterNumberStartString } from './string'

test('匹配以[数字/数字]开头的正则表达式', () => {
  expect(
    filterNumberStartString(
      '[1/2] [chromium] › task-5.spec.js:11:3 › page width 800px › leftbar visible'
    )
  ).toBe(true)

  expect(
    filterNumberStartString(
      '  1) [chromium] › task-5.spec.js:11:3 › page width 800px › leftbar visible '
    )
  ).toBe(false)
})
