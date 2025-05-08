import {
  type CompletionOptions,
  type ModelProvider,
  type Model,
} from '@web-bench/evaluator-types'
import { type BaseLLM } from './llm/base'

export { Model, ModelProvider }

export interface BenchAgentConfig extends CompletionOptions {}

export interface ScheduleTask {
  /**
   * task id
   */
  id: string
  /**
   * llm 实例
   */
  llm: BaseLLM
  /**
   * 发起请求时间
   */
  requestTime: number
  /**
   * 请求 token 数
   */
  inputToken: number
  /**
   * 返回消耗 token 数
   */
  outputToken: number
  /**
   *  执行代码
   */
  run: () => Promise<void>
}
