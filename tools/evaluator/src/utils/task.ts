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

// {"id":"task-1","date":"2024-11-01","level":"easy","description":"add divs with class 'header', ..."}
export interface RawTask {
  id: string
  date: string
  level: Task['level']
  description: string
  context?: string[]
  test?: string[]
}

export function tasks2setting(tasks: RawTask[], projectDir: string): Task[] {
  const hasInit = tasks.find((task) => task.id === 'init')

  return tasks.map((task, index) => {
    return {
      id: task.id,
      description: task.description,
      date: task.date,
      index: hasInit ? index : index + 1,
      level: task.level,
      isInit: task.id === 'init',
      context: task.context,
      testcase: task.test,
    }
  })
}

export function getTasksFromStartTaskToEndTask(
  tasks: Task[],
  startTask?: string,
  endTask?: string
) {
  const length = tasks.length

  if (!length) {
    return tasks
  }

  let startIdx = startTask ? tasks.findIndex((task) => task.id === startTask) : 0
  let endIdx = endTask ? tasks.findIndex((task) => task.id === endTask) : length - 1

  if (startIdx === -1) {
    startIdx = 0
  }

  if (endIdx === -1) {
    endIdx = length - 1
  }

  return [...tasks].splice(startIdx, endIdx + 1 - startIdx)
}
