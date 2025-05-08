import { TaskSnippet } from '@web-bench/evaluator-types'
import { expect, test } from 'vitest'
import { getErrorRate, getPassRate } from './report'

const Result = {
  success: {
    success: true,
  },
  fail: {
    success: false,
  },
}

const getTaskSnippets = (
  count: Number,
  result: TaskSnippet['result'][0] = Result.success
): TaskSnippet[] => {
  const arr = new Array(count).fill(0)

  return arr.map((_, i) => ({
    id: '' + i,
    description: '',
    result: [result],
  }))
}

test('pass@n 总共 20 个 task, 6、8 第一次失败, 11 次都失败', () => {
  /**
   * task-1 *  ✅    -
   * task-2 *  ✅    -
   * task-3 *  ✅    -
   * task-4 *  ✅    -
   * task-5 *  ✅    -
   * task-6 *  ❌    ✅
   * task-7 *  ✅    -
   * task-8 *  ❌    ✅
   * task-9 *  ✅    -
   * task-10 * ✅    -
   * task-11 * ❌    ❌
   */
  const snippets1: TaskSnippet[] = getTaskSnippets(11)
  snippets1[5].result = [Result.fail, Result.success]
  snippets1[7].result = [Result.fail, Result.success]
  snippets1[10].result = [Result.fail, Result.fail]

  // pass@1: 25%, pass@2: 50%
  expect(getPassRate(snippets1, 20, 2)).toStrictEqual([25, 50])
  // fail@1: 15% ( 3/20 )
  expect(getErrorRate(snippets1, 20, 2)).toStrictEqual([15])
})

test('pass@n 总共 20 个 task, 6、8 第一次失败, 11 次都失败', () => {
  /**
   * task-1 *  ✅    -
   * task-2 *  ✅    -
   * task-3 *  ✅    -
   * task-4 *  ✅    -
   * task-5 *  ✅    -
   * task-6 *  ✅    -
   * task-7 *  ✅    -
   * task-8 *  ✅    -
   * task-9 *  ✅    -
   * task-10 * ✅    -
   * task-11 * ❌    ❌
   */
  const snippets1: TaskSnippet[] = getTaskSnippets(11)
  snippets1[10].result = [Result.fail, Result.fail]

  // pass@1: 50%, pass@2: 50%
  expect(getPassRate(snippets1, 20, 2)).toStrictEqual([50, 50])
  // fail@1: 5% ( 1/20 )
  expect(getErrorRate(snippets1, 20, 2)).toStrictEqual([5])
})

test('pass@n 总共 20 个 task全通过', () => {
  const snippets2: TaskSnippet[] = getTaskSnippets(20)
  // pass@1: 100%, pass@2: 100%
  expect(getPassRate(snippets2, 20, 2)).toStrictEqual([100, 100])
  // fail@1: 0%
  expect(getErrorRate(snippets2, 20, 2)).toStrictEqual([0])
})

test('pass@n 总共 20 个 task,第一个就全失败了', () => {
  const snippets2: TaskSnippet[] = getTaskSnippets(1, Result.fail)
  // pass@1: 0%, pass@2: 0%
  expect(getPassRate(snippets2, 20, 2)).toStrictEqual([0, 0])
  // fail@1: 5%
  expect(getErrorRate(snippets2, 20, 2)).toStrictEqual([5])
})
