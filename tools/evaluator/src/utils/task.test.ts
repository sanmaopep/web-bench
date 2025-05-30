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

import { Task } from '@web-bench/evaluator-types'
import { describe, expect, test } from 'vitest'
import { getTasksFromStartTaskToEndTask, tasks2setting } from './task'

test('tasks2setting init', () => {
  expect(
    tasks2setting(
      [
        {
          id: 'init',
          date: '2024-10-25',
          level: 'easy',
          description:
            "generate a calculator in a single HTML file. the first row should be an input element with id 'display'; the next 4 rows should contain buttons with digits from '0' to '9' and operators including '+-*/=.'; the last row should have a 'Clear' button. display 'Error' when catching exception or getting undefined value during calculating.",
        },
      ],
      'projects/calculator'
    )
  ).toStrictEqual([
    {
      id: 'init',
      date: '2024-10-25',
      level: 'easy',
      index: 0,
      isInit: true,
      description:
        "generate a calculator in a single HTML file. the first row should be an input element with id 'display'; the next 4 rows should contain buttons with digits from '0' to '9' and operators including '+-*/=.'; the last row should have a 'Clear' button. display 'Error' when catching exception or getting undefined value during calculating.",
      testcase: undefined,
      context: undefined,
    },
  ])

  expect(
    tasks2setting(
      [
        {
          id: 'task-1',
          date: '2024-10-25',
          level: 'easy',
          description: '',
        },
      ],
      'projects/calculator'
    )
  ).toStrictEqual([
    {
      id: 'task-1',
      date: '2024-10-25',
      level: 'easy',
      index: 1,
      isInit: false,
      description: '',
      testcase: undefined,
      context: undefined,
    },
  ])
})

function getTask(index: number): Task {
  return {
    id: index === 0 ? 'init' : `task-${index}`,
    isInit: index === 0,
    description: '',
    level: 'easy',
    index: index,
    date: '',
  }
}

const tasks = new Array(21).fill(0).map((_, index) => getTask(index))

describe('getTasksFromStartTaskToEndTask test ', () => {
  test('tasks 21, start empty, end empty', () => {
    // Both start and end omitted
    const res = getTasksFromStartTaskToEndTask(tasks)
    expect(res.length).toBe(21)
    expect(res[0]?.id).toBe('init')
    expect(res[20]?.id).toBe('task-20')
  })

  test('tasks 21, start init, end task-20', () => {
    // From beginning to end
    const res = getTasksFromStartTaskToEndTask(tasks, 'init', 'task-20')
    expect(res.length).toBe(21)
    expect(res[0]?.id).toBe('init')
    expect(res[20]?.id).toBe('task-20')
  })

  test('tasks 21, start task-3, end task-20', () => {
    // From middle to end
    const res = getTasksFromStartTaskToEndTask(tasks, 'task-3')
    expect(res.length).toBe(18)
    expect(res[0]?.id).toBe('task-3')
    expect(res[17]?.id).toBe('task-20')
  })

  test('tasks 21, start init, end task-5', () => {
    // From start to middle
    const res = getTasksFromStartTaskToEndTask(tasks, 'init', 'task-5')
    expect(res.length).toBe(6)
    expect(res[0]?.id).toBe('init')
    expect(res[5]?.id).toBe('task-5')
  })

  test('tasks 21, start task-9, end task-16', () => {
    // From middle to middle
    const res = getTasksFromStartTaskToEndTask(tasks, 'task-9', 'task-16')
    expect(res.length).toBe(8)
    expect(res[0]?.id).toBe('task-9')
    expect(res[7]?.id).toBe('task-16')
  })

  test('tasks 21, start task-9, end task-9', () => {
    // Start and end points coincide
    const res = getTasksFromStartTaskToEndTask(tasks, 'task-9', 'task-9')
    expect(res.length).toBe(1)
    expect(res[0]?.id).toBe('task-9')
    expect(res[0]?.id).toBe('task-9')
  })

  test('tasks 21, start task-10000, end task-10000', () => {
    // Invalid start and end points
    const res = getTasksFromStartTaskToEndTask(tasks, 'task-10000', 'task-10000')
    expect(res.length).toBe(21)
    expect(res[0]?.id).toBe('init')
    expect(res[20]?.id).toBe('task-20')
  })

  test('tasks 0, start init, end init', () => {
    // Zero tasks
    const res = getTasksFromStartTaskToEndTask([], 'init', 'init')
    expect(res.length).toBe(0)
  })
})
