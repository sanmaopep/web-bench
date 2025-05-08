// Copyright (c) 2023-2024 Continue Dev, Inc.
// Copyright (c) 2024-2025 Bytedance Ltd.
// SPDX-License-Identifier: Apache-2.0
//
// This file has been modified by Bytedance Ltd on BaseLLM
//
// Original file was released under Apache-2.0, with the full license text
// available at https://github.com/continuedev/continue?tab=Apache-2.0-1-ov-file.
//
// This modified file is released under the same license.

import { ChatMessage, CompletionOptions } from '@web-bench/evaluator-types'
import { Model, ScheduleTask } from '../type'
import { FetchUtils } from '../utils/fetch'

export interface LLMOption {
  contextLength: number
  maxTokens: number
  temperature?: number
  apiBase: string
}
export abstract class BaseLLM {
  abstract provider: string

  abstract option: LLMOption

  info: Model

  get apiBase(): string {
    if (this.info.apiBase) {
      if (this.info.apiBase.endsWith('/')) {
        return this.info.apiBase
      }
      return `${this.info.apiBase}/`
    }
    return this.option.apiBase
  }

  public constructor(info: Model) {
    this.info = info
  }

  abstract chat(
    compiledMessages: ChatMessage[],
    originOptions: CompletionOptions
  ): Promise<{
    request: string
    error?: string
    response: string
  }>

  public fetch(url: RequestInfo | URL, originInit?: RequestInit) {
    const customFetch = async (input: URL | RequestInfo, init: any) => {
      try {
        const resp = await FetchUtils.fetchwithRequestOptions(new URL(input as any), {
          ...init,
        })

        // Error mapping to be more helpful
        if (!resp.ok) {
          let text = await resp.text()
          if (resp.status === 404 && !resp.url.includes('/v1')) {
            if (text.includes('try pulling it first')) {
              const model = JSON.parse(text).error.split(' ')[1].slice(1, -1)
              text = `The model "${model}" was not found. To download it, run \`ollama run ${model}\`.`
            } else if (text.includes('/api/chat')) {
              text =
                'The /api/chat endpoint was not found. This may mean that you are using an older version of Ollama that does not support /api/chat. Upgrading to the latest version will solve the issue.'
            } else {
              text =
                "This may mean that you forgot to add '/v1' to the end of your 'apiBase' in config.json."
            }
          } else if (resp.status === 404 && resp.url.includes('api.openai.com')) {
            text = 'You may need to add pre-paid credits before using the OpenAI API.'
          } else if (
            resp.status === 401 &&
            (resp.url.includes('api.mistral.ai') || resp.url.includes('codestral.mistral.ai'))
          ) {
            if (resp.url.includes('codestral.mistral.ai')) {
              throw new Error(
                "You are using a Mistral API key, which is not compatible with the Codestral API. Please either obtain a Codestral API key, or use the Mistral API by setting 'apiBase' to 'https://api.mistral.ai/v1' in config.json."
              )
            } else {
              throw new Error(
                "You are using a Codestral API key, which is not compatible with the Mistral API. Please either obtain a Mistral API key, or use the the Codestral API by setting 'apiBase' to 'https://codestral.mistral.ai/v1' in config.json."
              )
            }
          }
          throw new Error(`HTTP ${resp.status} ${resp.statusText} from ${resp.url}\n\n${text}`)
        }

        return resp
      } catch (e: any) {
        // Errors to ignore
        if (e.message.includes('/api/tags')) {
          throw new Error(`Error fetching tags: ${e.message}`)
        } else if (e.message.includes('/api/show')) {
          throw new Error(
            `HTTP ${e.response.status} ${e.response.statusText} from ${e.response.url}\n\n${e.response.body}`
          )
        } else {
          console.debug(
            `${e.message}\n\nCode: ${e.code}\nError number: ${e.errno}\nSyscall: ${e.erroredSysCall}\nType: ${e.type}\n\n${e.stack}`
          )

          if (e.code === 'ECONNREFUSED' && e.message.includes('http://127.0.0.1:11434')) {
            throw new Error(
              'Failed to connect to local Ollama instance. To start Ollama, first download it at https://ollama.ai.'
            )
          }
        }
        throw new Error(e.message)
      }
    }

    return customFetch(url, originInit)
  }

  public checkLimit: (_: { runningTask: ScheduleTask[] }) => boolean = () => true

  public abstract countToken: (compiledMessages: ChatMessage[]) => Promise<number>
}
