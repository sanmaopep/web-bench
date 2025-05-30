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

import { AgentRequest, AgentResponse, IAgent } from './agent'
import { EvaluatorConfig } from './config'
import { IProjectRunner } from './project'
import { Task, TaskResultSnippet, TaskSnippet } from './task'

type Undefinable<T> = T | undefined
type HookReturnType<T> = Promise<Undefinable<T>>

export interface EvalPluginHook {
  /**
   *
   * @param ctx
   * @returns
   */
  onInitConfig?: (ctx: { config: EvaluatorConfig }) => HookReturnType<EvaluatorConfig>

  /**
   *
   */
  onEvalStart?: (ctx: { config: EvaluatorConfig; hash: string }) => HookReturnType<void>

  /**
   *
   */
  onTaskStart?: (ctx: {
    project: IProjectRunner
    task: Task
    times: number
  }) => HookReturnType<void>

  /**
   *
   */
  onTaskEnd?: (ctx: {
    project: IProjectRunner
    task: Task
    result: TaskResultSnippet
    times: number
    index: number
  }) => HookReturnType<void>

  /**
   *
   */
  onEvalEnd?: (ctx: {
    config: EvaluatorConfig
    hash: string
    projects: IProjectRunner[]
    agents: IAgent[]
  }) => HookReturnType<void>

  /**
   *
   */
  onProjectStart?: (ctx: { project: IProjectRunner; hash: string }) => HookReturnType<void>

  /**
   *
   */
  onProjectEnd?: (ctx: {
    project: IProjectRunner

    hash: string
  }) => HookReturnType<void>

  /**
     * hooks: Get task list for current execution
     * @returns New task list
     */
  onGetTasks?: (ctx: { originTasks?: Undefinable<Task[]> }) => HookReturnType<Task[]>

  /**
     * hooks: Collect task context
     * @returns New context path
     */
  onTaskContextCollect?: (ctx: {
    task: Task
    project: IProjectRunner
  }) => HookReturnType<Record<string, string>>

  /**
     * hooks: Task calls agent to get result
     * @returns New agent result
     */
  onTaskCallAgent?: (ctx: {
    request: AgentRequest
    response: Undefinable<AgentResponse>
    project: IProjectRunner
  }) => HookReturnType<AgentResponse>

  /**
     * hooks: Task writes agent result to file
     * @returns New file content
     */
  onTaskRewriteFiles?: (ctx: {
    task: Task
    files: Record<string, string>
    project: IProjectRunner
    times: number
  }) => HookReturnType<void>

  /**
     * hooks: Initialize task runtime environment
     * @returns New initialization cwd
     */
  onTaskInitEnv?: (ctx: { task: Task; project: IProjectRunner }) => HookReturnType<string>

  /**
   *
   */
  onTaskScreenshot?: (ctx: {
    task: Task
    project: IProjectRunner
    screenshotPath: string
  }) => HookReturnType<void>

  /**
     * hooks: Task builds code
     * @returns New build cwd
     */
  onTaskBuild?: (ctx: {
    task: Task
    // cwd: string
    project: IProjectRunner
  }) => HookReturnType<string>

  /**
     * hooks: Task executes tests
     * @returns New test cwd
     */
  onTaskTest?: (ctx: {
    task: Task
    project: IProjectRunner
    times: number
  }) => HookReturnType<string>

  /**
     * hooks: Task retry after error
     */
  onTaskRetry?: (ctx: { project: IProjectRunner }) => void
  /**
     * hooks: Generate report
     */
  onReport?: (ctx: { taskSnippet: TaskSnippet[]; project: IProjectRunner }) => HookReturnType<void>
}

export interface EvalPlugin extends EvalPluginHook {
  /**
   * plugin name
   */
  name: string

  /**
     * Plugin execution order, set to default for execution phase (only one default allowed)
     * default: pre
     */
  enforce?: 'pre' | 'post' | 'replace'
}
