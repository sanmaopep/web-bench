import { expect, test } from 'vitest'
import { clearErrorMsg } from './error'

test('清理 errormsg 的一些无关信息', () => {
  expect(
    clearErrorMsg(
      '/Documents/project/web-bench/projects/calculator/test/task-1.spec.js:13:14',
      ['/Documents/project/web-bench/projects/calculator/test']
    )
  ).toBe('./task-1.spec.js:13:14')

  expect(
    clearErrorMsg(
      'at /Documents/project/web-bench/projects/calculator/test/task-1.spec.js /Users/bytedance/Documents/project/web-bench/projects/calculator/test/task-1.spec.js:13:14',
      ['/Documents/project/web-bench/projects/calculator/test']
    )
  ).toBe('at ./task-1.spec.js ./task-1.spec.js:13:14')
})
