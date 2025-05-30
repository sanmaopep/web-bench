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

import { Ignore } from 'ignore'

import { IAgent } from '../agent'
import { ProjectSetting, ProjectSettingGetter } from '../config'
import { ILogger } from '../logger'
import { IRunner } from '../runner'
import { ITaskRunner, TaskSnippet } from '../task'

/**
 * Project runner definition
 */
export interface IProjectRunner extends IRunner {
  hash: string

  /**
     * Runtime settings
     */
  settings: ProjectSetting

  /**
     * Runtime results
     */
  tasks: ITaskRunner[]

  currentTask?: ITaskRunner

  projectGetter: ProjectSettingGetter

  /**
     * Store plugin context
     */
  metadata: Map<string, any>

  ignore: {
    getIgnore(): Promise<Ignore>
  }

  taskSnippets: TaskSnippet[]
  /**
     * Get logger management
     */
  logger: ILogger

  /**
   *
   */
  agent: IAgent

  updateSettings: (settings: ProjectSetting) => void
}
