import { Response } from 'node-fetch'
import { ScheduleTask } from '../type'
import { LLMOption } from './base'
import { OpenAILLM } from './openai'
import axios, { AxiosRequestConfig } from 'axios'
import axiosRetry from 'axios-retry'

export class Doubao extends OpenAILLM {
  provider = 'doubao'

  option: LLMOption = {
    contextLength: 10_000,
    maxTokens: 1024 * 4,
    apiBase: 'https://ark.cn-beijing.volces.com/api/v3/',
  }

  public checkLimit: (_: { runningTask: ScheduleTask[] }) => boolean = ({ runningTask }) => {
    return runningTask.length < 10
  }

  public async fetch(url: RequestInfo | URL, originInit: RequestInit = {}): Promise<Response> {
    const client = axios.create()

    // 配置重试机制
    axiosRetry(client, {
      retries: 3, // 重试次数
      retryDelay: (retryCount) => {
        return retryCount * 1000 // 重试延迟时间
      },
      retryCondition: (error) => {
        // 只在网络错误或 TLS 错误时重试
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.message.includes('Client network socket disconnected')
        )
      },
    })

    const res = await client.post(url.toString(), JSON.parse(originInit.body?.toString() || '{}'), {
      headers: originInit.headers as AxiosRequestConfig['headers'],
    })

    return {
      async json() {
        return res.data
      },
    } as Response
  }
}
