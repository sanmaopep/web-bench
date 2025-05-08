import { EventEmitter } from 'events'

export type ModelProvider = 'anthropic' | 'openrouter' | 'openai' | 'doubao' | 'deepseek' | 'aliyun'

export interface Model {
  model: string
  provider: ModelProvider
  apiKey: string
  title: string
  apiBase?: string
  stream?: boolean
  apiVersion?: string
  useLegacyCompletionsEndpoint?: boolean
  [key: string]: any
}

export interface AgentResponse {
  // Code files, key is filePath, value is fileContent
  files: Record<string, string>

  // [filePath:string]: string  Poor Extension
}

export interface AgentRequest {
  type: 'normal' | 'init'

  task: string

  // Code files, key is filePath, value is fileContent
  files?: Record<string, string>

  // Error context
  error?: string
}

/**
 * evaluation 事件参数定义
 * key 为事件名，value 为回调参数
 */
export interface AgentEvent {
  /**
   * llm，网络请求，回调第一参数为 request, 第二参数为 response
   */
  onRequest: [string, string]
  /**
   * log 事件
   */
  log: ['info' | 'warn' | 'error' | 'debug', string]
}

export interface IAgent {
  /**
   * Agent 唯一索引
   */
  key?: string
  /**
   * 关联的 model
   */
  model?: Model

  /**
   * 事件 emit
   */
  emitter?: EventEmitter<AgentEvent>

  /**
   * endpoint
   */
  endpoint?: string

  /**
   * 请求接口
   */
  request: (req: AgentRequest) => Promise<AgentResponse>
  /**
   * clone agent
   */
  clone?: () => IAgent
}
