import { Ignore } from 'ignore'

import { IAgent } from '../agent'
import { ProjectSetting, ProjectSettingGetter } from '../config'
import { ILogger } from '../logger'
import { IRunner } from '../runner'
import { ITaskRunner, TaskSnippet } from '../task'

/**
 * project runner 定义
 */
export interface IProjectRunner extends IRunner {
  hash: string

  /**
   * 运行设置
   */
  settings: ProjectSetting

  /**
   * 运行结果
   */
  tasks: ITaskRunner[]

  currentTask?: ITaskRunner

  projectGetter: ProjectSettingGetter

  /**
   * 存储 plugin 上下文
   */
  metadata: Map<string, any>

  ignore: {
    getIgnore(): Promise<Ignore>
  }

  taskSnippets: TaskSnippet[]
  /**
   * 获取日志管理
   */
  logger: ILogger

  /**
   *
   */
  agent: IAgent

  updateSettings: (settings: ProjectSetting) => void
}
