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
      testcase: [`projects/calculator/test/init.spec.js`],
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
      testcase: [`projects/calculator/test/task-1.spec.js`],
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
    // 前后都省略
    const res = getTasksFromStartTaskToEndTask(tasks)
    expect(res.length).toBe(21)
    expect(res[0]?.id).toBe('init')
    expect(res[20]?.id).toBe('task-20')
  })

  test('tasks 21, start init, end task-20', () => {
    // 开头到结尾
    const res = getTasksFromStartTaskToEndTask(tasks, 'init', 'task-20')
    expect(res.length).toBe(21)
    expect(res[0]?.id).toBe('init')
    expect(res[20]?.id).toBe('task-20')
  })

  test('tasks 21, start task-3, end task-20', () => {
    // 中间到结束
    const res = getTasksFromStartTaskToEndTask(tasks, 'task-3')
    expect(res.length).toBe(18)
    expect(res[0]?.id).toBe('task-3')
    expect(res[17]?.id).toBe('task-20')
  })

  test('tasks 21, start init, end task-5', () => {
    // 开始到中间
    const res = getTasksFromStartTaskToEndTask(tasks, 'init', 'task-5')
    expect(res.length).toBe(6)
    expect(res[0]?.id).toBe('init')
    expect(res[5]?.id).toBe('task-5')
  })

  test('tasks 21, start task-9, end task-16', () => {
    // 中间到中间
    const res = getTasksFromStartTaskToEndTask(tasks, 'task-9', 'task-16')
    expect(res.length).toBe(8)
    expect(res[0]?.id).toBe('task-9')
    expect(res[7]?.id).toBe('task-16')
  })

  test('tasks 21, start task-9, end task-9', () => {
    // 起点终点重合
    const res = getTasksFromStartTaskToEndTask(tasks, 'task-9', 'task-9')
    expect(res.length).toBe(1)
    expect(res[0]?.id).toBe('task-9')
    expect(res[0]?.id).toBe('task-9')
  })

  test('tasks 21, start task-10000, end task-10000', () => {
    // 起点终点非法
    const res = getTasksFromStartTaskToEndTask(tasks, 'task-10000', 'task-10000')
    expect(res.length).toBe(21)
    expect(res[0]?.id).toBe('init')
    expect(res[20]?.id).toBe('task-20')
  })

  test('tasks 0, start init, end init', () => {
    // task 0 个
    const res = getTasksFromStartTaskToEndTask([], 'init', 'init')
    expect(res.length).toBe(0)
  })
})
