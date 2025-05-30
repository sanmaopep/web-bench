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

test('pass@n total 20 tasks, 6 and 8 failed the first time, 11 failed all times', () => {
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

test('pass@n total 20 tasks, 6 and 8 failed the first time, 11 failed all times', () => {
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

test('pass@n total 20 tasks, all passed', () => {
  const snippets2: TaskSnippet[] = getTaskSnippets(20)
  // pass@1: 100%, pass@2: 100%
  expect(getPassRate(snippets2, 20, 2)).toStrictEqual([100, 100])
  // fail@1: 0%
  expect(getErrorRate(snippets2, 20, 2)).toStrictEqual([0])
})

test('pass@n total 20 tasks, the first one failed completely', () => {
  const snippets2: TaskSnippet[] = getTaskSnippets(1, Result.fail)
  // pass@1: 0%, pass@2: 0%
  expect(getPassRate(snippets2, 20, 2)).toStrictEqual([0, 0])
  // fail@1: 5%
  expect(getErrorRate(snippets2, 20, 2)).toStrictEqual([5])
})
