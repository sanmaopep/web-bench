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
  inputTokens: number
  /**
   * 返回消耗 token 数
   */
  outputTokens: number
  /**
   *  执行代码
   */
  run: () => Promise<void>
}
