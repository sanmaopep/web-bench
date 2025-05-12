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

import { IRunner } from './runner'

export interface Task {
  /**
   * task ID
   */
  id: string
  /**
   * index, range (0, tasks.length in tasks.jsonl)
   */
  index: number
  /**
   * task description
   */
  description: string
  /**
   * date, format "YYYY-MM-DD"
   * example: 2024-10-25
   */
  date: string
  /**
   * level
   */
  level: 'easy' | 'challenging' | 'moderate'
  /**
   * task context
   */
  context?: string[]
  /**
   * validate by test case
   */
  testcase?: string[]
  /**
   * is init task
   */
  isInit: boolean
}

export interface TaskResultSnippet {
  /**
   * is success
   */
  success: boolean
  /**
   * request
   */
  request?: string
  /**
   * screenshot
   */
  screenshot?: string
  /**
   * response
   */
  response?: Record<string, string>
  /**
   * errorMessage
   */
  errorMessage?: string
}

export interface TaskSnippet {
  /**
   * task ID
   */
  id: string
  /**
   * description
   */
  description: string
  /**
   * 每次执行结果快照，可能会执行多次
   */
  result: TaskResultSnippet[]
}

/**
 * task runner 定义
 */
export interface ITaskRunner extends IRunner {
  /**
   * value
   */
  task: Task
  /**
   * 当前执行信息
   */
  executeInfo?: {
    /**
     * 执行次数
     */
    times: number
  }
}
