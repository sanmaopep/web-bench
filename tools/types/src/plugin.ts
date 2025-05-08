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
   * hooks：获取本次执行的任务列表
   * @returns 返回新的任务列表
   */
  onGetTasks?: (ctx: { originTasks?: Undefinable<Task[]> }) => HookReturnType<Task[]>

  /**
   * hooks：收集 task 上下文
   * @returns 返回新的上下文路径
   */
  onTaskContextCollect?: (ctx: {
    task: Task
    project: IProjectRunner
  }) => HookReturnType<Record<string, string>>

  /**
   * hooks：task 调用 agent 获取结果
   * @returns 返回新的 agent 结果
   */
  onTaskCallAgent?: (ctx: {
    request: AgentRequest
    response: Undefinable<AgentResponse>
    project: IProjectRunner
  }) => HookReturnType<AgentResponse>

  /**
   * hooks：task 将 agent 结果写入文件内容
   * @returns 返回新的写入文件内容
   */
  onTaskRewriteFiles?: (ctx: {
    task: Task
    files: Record<string, string>
    project: IProjectRunner
    times: number
  }) => HookReturnType<void>

  /**
   * hooks：task 初始化运行环境
   * @returns 返回新的初始化 cwd
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
   * hooks：task 构建代码
   * @returns 返回新的构建 cwd
   */
  onTaskBuild?: (ctx: {
    task: Task
    // cwd: string
    project: IProjectRunner
  }) => HookReturnType<string>

  /**
   * hooks：task 执行测试
   * @returns 返回新的测试 cwd
   */
  onTaskTest?: (ctx: {
    task: Task
    project: IProjectRunner
    times: number
  }) => HookReturnType<string>

  /**
   * hooks：task 出错后重试
   */
  onTaskRetry?: (ctx: { project: IProjectRunner }) => void
  /**
   * hooks：生成 report
   */
  onReport?: (ctx: { taskSnippet: TaskSnippet[]; project: IProjectRunner }) => HookReturnType<void>
}

export interface EvalPlugin extends EvalPluginHook {
  /**
   * plugin name
   */
  name: string

  /**
   * plugin 执行顺序，设置为 default 则为执行阶段执行，仅支持一个 default 执行
   * default: pre
   */
  enforce?: 'pre' | 'post' | 'replace'
}
