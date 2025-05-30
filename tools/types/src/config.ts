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

import { EvalPlugin } from './plugin'
import { Task } from './task'

export type LoggerLevel = 'info' | 'warn' | 'debug' | 'error'

export type AgentMode = 'local' | 'http'

export type TaskMode = 'parallel' | 'sequential'

export type EvalProjectType = 'bench' | 'custom'
interface BaseConfig {
  /**
   * default custom
   */
  projectType?: EvalProjectType

  /**
   * report Name
   */
  name?: string
  /**
     * Default 2
     */
  retry?: number
  /**
   * logLevel
   * default: "info"
   * "info" | "warn" | "debug" | "error"
   */
  logLevel?: LoggerLevel

  /**
   * agent mode
   * default: "sequential"
   * "parallel" | "sequential"
   */
  taskMode?: TaskMode
  /**
   * custom plugin
   */
  plugins?: (EvalPlugin | string)[]
  /**
   * agent src
   */
  agentDir?: string
  /**
   * Task executed starts from, including startTask
   * default task is the first task of tasks.jsonl
   */
  startTask?: string
  /**
   * Task executed ends to, including endTask
   * default task is the last task of tasks.jsonl
   */
  endTask?: string
  /**
   * is eval production mode
   * default: true
   */
  production?: boolean
  /**
   * file diff log
   * default: false
   */
  fileDiffLog?: boolean
  /**
   * screenshot log
   * default: false
   */
  screenshotLog?: boolean
}
/**
 * User-configurable config exposed externally
 */
export interface ProjectConfig extends BaseConfig {
  /**
   * project name
   */
  packageName: string

  /**
   * model name
   */
  model?: string
  /**
   * endpoint
   */
  endpoint?: string
}

export interface EvaluatorConfig extends BaseConfig {
  /**
   * hash
   */
  hash?: string
  /**
   * project name
   */
  projects?: string[]
  /**
   * agent mode
   * default: "local"
   * "local" | "http"
   */
  agentMode?: AgentMode
  /**
   * agentEndPoint
   * When the mode is set to "http", set http api for network requests.
   * example: "http://localhost:6077/message"
   * request type: AgentRequest
   * response type: AgentResponse
   */
  agentEndPoint?: string
  /**
   * When the mode is set to "http", maximum concurrent requests
   * default: 10
   */
  httpLimit?: number
  /**
   * max degree of parallelism
   */
  maxdop?: number

  /**
   * path of the task description file
   * default: "tasks.jsonl"
   */
  taskSrc?: string
}

/**
 * Complete project runtime configuration that tools need to be aware of internally
 * Unlike config which is for external users, setting is for tools developers
 */
export interface ProjectSetting
  extends Required<
      Omit<
        ProjectConfig,
        'model' | 'endpoint' | 'startTask' | 'endTask' | 'projectType' | 'plugins'
      >
    >,
    Pick<ProjectConfig, 'model' | 'endpoint'> {
  /**
   * test env
   * Currently, only playwright is supported.
   */
  tester: string
  /**
   * related task
   */
  tasks: Task[]
  /**
   * count of tasks without init
   */
  taskCount: number
  /**
   * project src
   */
  projectDir: string
  /**
   * agent src
   */
  agentDir: string
  /**
   * test src
   */
  testDir: string

  /**
   * test util src
   */
  testUtilDir: string
  /**
   * init source src
   */
  initDir: string
  /**
   * src
   */
  srcDir: string
  /**
   * response write src
   */
  outputWorkspaceDir: string
  /**
   * response write src
   */
  outputProjectDir: string[]
  /**
   * project output src files
   * relative path, "index.html"
   */
  files: string[]
  /**
   * project init src files
   */
  initFiles: string[]
  /**
   * project origin name like "flex"
   */
  originName: string
  /**
   * don't screenshot
   */
  notScreenshot: boolean
  /**
   * repository dir
   */
  repositoryDir: string

  evalRootDir: string

  /**
   * need build to check agent response
   */
  needBuild: boolean
  /**
   * task need init
   */
  needInit: boolean

  assetsDir?: string
  /**
   * file validate config
   */
  fileValidate?: {
    /**
     * exclude files
     */
    exclude?: string[]
  }

  /**
   * Full package.json
   */
  packageJson?: Record<string, any>
}

/**
 *
 */
export interface ProjectSettingGetter {
  /**
     * Get project configuration
     */
  getInitProjectSetting: (project: ProjectConfig) => Promise<ProjectSetting>
  /**
     * Update Setting before running Task (granularity is per task execution, retries will trigger again)
     */
  updateSettingBeforeRunTask: (
    setting: ProjectSetting,
    ctx: {
      task: Task
      times: number
    }
  ) => Promise<ProjectSetting>
}

export interface ProjectEvalConfig {
  /**
   * file validate config
   */
  fileValidate?: {
    /**
     * exclude files
     */
    exclude?: string[]
  }
  /**
   * project is stable
   */
  stable?: boolean
  /**
   * should screenshot
   * default: true
   */
  screenshot?: boolean
}
