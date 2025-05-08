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
