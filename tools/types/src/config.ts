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
   * 默认 2
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
}
/**
 * 对外暴露的用户可配置的 config
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
 * tools 内部需要感知的完整的 project 运行的所有配置
 * 和 config 不同的是 config 是对外部用户，setting 是对 tools 开发者感知
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
}

/**
 *
 */
export interface ProjectSettingGetter {
  /**
   * 获取项目配置
   */
  getInitProjectSetting: (project: ProjectConfig) => Promise<ProjectSetting>
  /**
   * 运行 Task 前更新 Setting (粒度是 task 每次执行，即发生重试会也会再次触发)
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
