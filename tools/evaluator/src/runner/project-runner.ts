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
  IAgent,
  ILogger,
  IProjectRunner,
  ITaskRunner,
  ProjectConfig,
  ProjectSetting,
  ProjectSettingGetter,
  TaskSnippet,
} from '@web-bench/evaluator-types'
import { Logger } from '../logger'
import { getInitProjectSettingGetter } from '../settings'
import { TaskRunnerFactory } from './task-runner'
import { IgnoreGetter } from '../ignore'
import { PluginSchedule } from '../plugins/schedule'
import { getDefaultPlugins, getInternalPluginsByName } from '../plugins/plugin'

export class ProjectRunner implements IProjectRunner {
  /**
   * Complete project configuration
   */
  private _settings: ProjectSetting

  /**
   * Project user configuration
   */
  private _config: ProjectConfig

  public projectGetter: ProjectSettingGetter

  public hash: string

  public tasks: ITaskRunner[] = []

  public agent: IAgent

  public ignore: IgnoreGetter

  public logger: ILogger

  public taskSnippets: TaskSnippet[] = []

  public initPromise: undefined | Promise<void>

  public currentTask: ITaskRunner | undefined

  public pluginSchedule: PluginSchedule

  public metadata: Map<string, any> = new Map()

  constructor(config: ProjectConfig, hash: string, agent: IAgent) {
    this._config = config
    this.hash = hash
    this.agent = agent
    this.logger = new Logger(this)
    this.ignore = new IgnoreGetter(this)
    // const plugins =
    const plugins = [
      getDefaultPlugins(config.projectType).flat(),
      (config.plugins || [])
        .map((v) => (typeof v === 'string' ? getInternalPluginsByName(v) : v))
        .flat(),
    ]

    this.pluginSchedule = new PluginSchedule(plugins)

    // new ProjectReporter()
    // The init behavior is not exposed externally to avoid adding irrelevant logic for users
    this._initSetting()
  }

  private _initSetting = async () => {
    /**
     * Initialization
     */
    const init = async () => {
      this.projectGetter = getInitProjectSettingGetter(
        this._config.projectType,
        this.hash,
        this.pluginSchedule
      )

      const settingGetter = this.projectGetter
      // 1. init settings
      // Note: This generates the complete configuration based on the user-generated configuration. Note that it is the complete configuration.
      // Afterwards, it will not perceive any project structures; it will read directly.
      // For example, the path to the project's template files, like project / src-init, will be perceived in settingGetter.
      // Externally, only settings.initDir is perceived.
      // !! Do not concatenate paths separately outside.
      const settings = await settingGetter.getInitProjectSetting(this._config)
      this.updateSettings(settings)
      this.logger.silentLog(`settings`, JSON.stringify(settings))

      // 3. init task runner
      this.tasks = settings.tasks.map((t) => TaskRunnerFactory.create(t, this))
    }

    this.initPromise = init()

    if (this.initPromise) {
      await this.initPromise
    }

    this.initPromise = undefined
  }

  public get settings(): ProjectSetting {
    return this._settings
  }

  public updateSettings(settings: ProjectSetting) {
    this._settings = settings
    this.logger.silentLog('ProjectSetting', JSON.stringify(settings))
  }

  public async run() {
    if (this.initPromise) {
      await this.initPromise
    }

    this.pluginSchedule.run('onProjectStart', { project: this, hash: this.hash })

    const needBreak = this.settings.taskMode === 'sequential'

    // 5. Execute all tasks; exit if a task encounters an error.
    for (const runner of this.tasks) {
      this.currentTask = runner

      const res = await runner.run()
      if (!res && needBreak) {
        break
      }
    }

    await this.pluginSchedule.run('onProjectEnd', { project: this, hash: this.hash })
  }

  public addTaskSnippet(snippet: TaskSnippet) {
    this.taskSnippets.push(snippet)
  }
}
