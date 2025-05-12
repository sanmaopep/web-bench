// Copyright (c) 2023-2024 Continue Dev, Inc.
// Copyright (c) 2025 Bytedance Ltd.
// SPDX-License-Identifier: Apache-2.0
//
// This file has been modified by Bytedance Ltd on pruneChatHistory
//
// Original file was released under Apache-2.0, with the full license text
// available at https://github.com/continuedev/continue?tab=Apache-2.0-1-ov-file.
//
// This modified file is released under the same license.

import { ChatMessage, MessageContent } from '@web-bench/evaluator-types'
import { encodingForModel as _encodingForModel, Tiktoken } from 'js-tiktoken'
import llamaTokenizer from 'llama-tokenizer-js'

interface Encoding {
  encode: Tiktoken['encode']
  decode: Tiktoken['decode']
}

const TOKEN_BUFFER_FOR_SAFETY = 350
type TemplateType =
  | 'llama2'
  | 'alpaca'
  | 'zephyr'
  | 'phi2'
  | 'phind'
  | 'anthropic'
  | 'chatml'
  | 'none'
  | 'openchat'
  | 'deepseek'
  | 'xwin-coder'
  | 'neural-chat'
  | 'codellama-70b'
  | 'llava'
  | 'gemma'
  | 'llama3'

function autodetectTemplateType(model: string): TemplateType | undefined {
  const lower = model.toLowerCase()

  if (lower.includes('codellama') && lower.includes('70b')) {
    return 'codellama-70b'
  }

  if (
    lower.includes('gpt') ||
    lower.includes('command') ||
    lower.includes('chat-bison') ||
    lower.includes('pplx') ||
    lower.includes('gemini')
  ) {
    return undefined
  }

  if (lower.includes('llama3')) {
    return 'llama3'
  }

  if (lower.includes('llava')) {
    return 'llava'
  }

  if (lower.includes('tinyllama')) {
    return 'zephyr'
  }

  if (lower.includes('xwin')) {
    return 'xwin-coder'
  }

  if (lower.includes('dolphin')) {
    return 'chatml'
  }

  if (lower.includes('gemma')) {
    return 'gemma'
  }

  if (lower.includes('phi2')) {
    return 'phi2'
  }

  if (lower.includes('phind')) {
    return 'phind'
  }

  if (lower.includes('llama')) {
    return 'llama2'
  }

  if (lower.includes('zephyr')) {
    return 'zephyr'
  }

  // Claude requests always sent through Messages API, so formatting not necessary
  if (lower.includes('claude')) {
    return 'none'
  }

  if (lower.includes('codestral')) {
    return 'none'
  }

  if (lower.includes('alpaca') || lower.includes('wizard')) {
    return 'alpaca'
  }

  if (lower.includes('mistral') || lower.includes('mixtral')) {
    return 'llama2'
  }

  if (lower.includes('deepseek')) {
    return 'deepseek'
  }

  if (lower.includes('ninja') || lower.includes('openchat')) {
    return 'openchat'
  }

  if (lower.includes('neural-chat')) {
    return 'neural-chat'
  }

  return 'chatml'
}

export function stripImages(content: MessageContent): string {
  if (Array.isArray(content)) {
    return content
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
  }
  return content
}

export function countChatMessageTokens(modelName: string, message: ChatMessage) {
  return stripImages(message.content).length
}

export function countTokens(content: MessageContent, modelName: string) {
  return stripImages(content).length
}

function processText(text: string) {
  if (text.length > 300) {
    let first100 = text.slice(0, 100)
    let middle100 = text.slice(Math.floor(text.length / 2) - 50, Math.floor(text.length / 2) + 50)
    let last100 = text.slice(-100)
    return `${first100}...${middle100}...${last100}`
  }
  return text
}

function summarize(message: MessageContent): string {
  const context = Array.isArray(message) ? stripImages(message) : message

  return processText(context)
}
let gptEncoding: Encoding | null = null

class LlamaEncoding implements Encoding {
  encode(text: string): number[] {
    return llamaTokenizer.encode(text) as number[]
  }

  decode(tokens: number[]): string {
    return llamaTokenizer.decode(tokens)
  }
}

const llamaEncoding = new LlamaEncoding()

function pruneRawPromptFromTop(
  modelName: string,
  contextLength: number,
  prompt: string,
  tokensForCompletion: number
): string {
  const maxTokens = contextLength - tokensForCompletion - TOKEN_BUFFER_FOR_SAFETY
  return pruneStringFromTop(modelName, maxTokens, prompt)
}

function encodingForModel(modelName: string): Encoding {
  const modelType = autodetectTemplateType(modelName)

  if (!modelType || modelType === 'none') {
    if (!gptEncoding) {
      gptEncoding = _encodingForModel('gpt-4')
    }

    return gptEncoding
  }

  return llamaEncoding
}

function pruneStringFromTop(modelName: string, maxTokens: number, prompt: string): string {
  const encoding = encodingForModel(modelName)

  const tokens = encoding.encode(prompt, 'all', [])
  if (tokens.length <= maxTokens) {
    return prompt
  }

  return encoding.decode(tokens.slice(tokens.length - maxTokens))
}
export function pruneChatHistory(
  modelName: string,
  chatHistory: ChatMessage[],
  contextLength: number,
  tokensForCompletion: number
): ChatMessage[] {
  const encoding = encodingForModel(modelName)

  const e = chatHistory.reduce((acc, message) => {
    return acc + stripImages(message.content)
  }, '')


  let totalTokens =
    tokensForCompletion +
    chatHistory.reduce((acc, message) => {
      return acc + countChatMessageTokens(modelName, message)
    }, 0)

  const originTokens = totalTokens

  // 0. Prune any messages that take up more than 1/3 of the context length
  const longestMessages = [...chatHistory]
  longestMessages.sort((a, b) => b.content.length - a.content.length)

  const longerThanOneThird = longestMessages.filter(
    (message: ChatMessage) => countTokens(message.content, modelName) > contextLength / 3
  )
  const distanceFromThird = longerThanOneThird.map(
    (message: ChatMessage) => countTokens(message.content, modelName) - contextLength / 3
  )

  for (let i = 0; i < longerThanOneThird.length; i++) {
    // Prune line-by-line from the top
    const message = longerThanOneThird[i]
    const content = stripImages(message.content)
    const deltaNeeded = totalTokens - contextLength
    const delta = Math.min(deltaNeeded, distanceFromThird[i])
    message.content = pruneStringFromTop(
      modelName,
      countTokens(message.content, modelName) - delta,
      content
    )
    totalTokens -= delta
  }

  // 1. Replace beyond last 5 messages with summary
  let i = 0
  while (totalTokens > contextLength && i < chatHistory.length - 5) {
    const message = chatHistory[0]
    totalTokens -= countTokens(message.content, modelName)
    totalTokens += countTokens(summarize(message.content), modelName)
    message.content = summarize(message.content)
    i++
  }

  // 2. Remove entire messages until the last 5
  while (chatHistory.length > 5 && totalTokens > contextLength && chatHistory.length > 0) {
    const message = chatHistory.shift()!
    totalTokens -= countTokens(message.content, modelName)
  }

  // 3. Truncate message in the last 5, except last 1
  i = 0
  while (totalTokens > contextLength && chatHistory.length > 0 && i < chatHistory.length - 1) {
    const message = chatHistory[i]
    totalTokens -= countTokens(message.content, modelName)
    totalTokens += countTokens(summarize(message.content), modelName)
    message.content = summarize(message.content)
    i++
  }

  // 4. Remove entire messages in the last 5, except last 1
  while (totalTokens > contextLength && chatHistory.length > 1) {
    const message = chatHistory.shift()!
    totalTokens -= countTokens(message.content, modelName)
  }

  // 5. Truncate last message
  if (totalTokens > contextLength && chatHistory.length > 0) {
    const message = chatHistory[0]
    message.content = pruneRawPromptFromTop(
      modelName,
      contextLength,
      stripImages(message.content),
      tokensForCompletion
    )
    totalTokens = contextLength
  }

  return chatHistory
}

function flattenMessages(msgs: ChatMessage[]): ChatMessage[] {
  const flattened: ChatMessage[] = []
  for (let i = 0; i < msgs.length; i++) {
    const msg = msgs[i]
    if (flattened.length > 0 && flattened[flattened.length - 1].role === msg.role) {
      flattened[flattened.length - 1].content += `\n\n${msg.content || ''}`
    } else {
      flattened.push(msg)
    }
  }
  return flattened
}

export function compileChatMessages(
  modelName: string,
  msgs: ChatMessage[] | undefined,
  contextLength: number,
  maxTokens: number,
  supportsImages: boolean,
  prompt: string | undefined = undefined,
  functions: any[] | undefined = undefined,
  systemMessage: string | undefined = undefined
): ChatMessage[] {
  const msgsCopy = msgs
    ? msgs.map((msg) => ({ ...msg })).filter((msg) => msg.content !== '' && msg.role !== 'system')
    : []

  if (prompt) {
    const promptMsg: ChatMessage = {
      role: 'user',
      content: prompt,
    }
    msgsCopy.push(promptMsg)
  }

  if ((systemMessage && systemMessage.trim() !== '') || msgs?.[0].role === 'system') {
    let content = ''
    if (msgs?.[0].role === 'system') {
      content = stripImages(msgs?.[0].content)
    }
    if (systemMessage && systemMessage.trim() !== '') {
      const shouldAddNewLines = content !== ''
      if (shouldAddNewLines) {
        content += '\n\n'
      }
      content += systemMessage
    }
    const systemChatMsg: ChatMessage = {
      role: 'system',
      content,
    }
    // Insert as second to last
    // Later moved to top, but want second-priority to last user message
    msgsCopy.splice(-1, 0, systemChatMsg)
  }

  let functionTokens = 0
  if (functions) {
    for (const func of functions) {
      functionTokens += countTokens(JSON.stringify(func), modelName)
    }
  }

  if (maxTokens + functionTokens + TOKEN_BUFFER_FOR_SAFETY >= contextLength) {
    throw new Error(
      `maxTokens (${maxTokens}) is too close to contextLength (${contextLength}), which doesn't leave room for response. Try increasing the contextLength parameter of the model in your config.json.`
    )
  }

  // If images not supported, convert MessagePart[] to string
  if (!supportsImages) {
    for (const msg of msgsCopy) {
      if ('content' in msg && Array.isArray(msg.content)) {
        const content = stripImages(msg.content)
        msg.content = content
      }
    }
  }

  const history = pruneChatHistory(
    modelName,
    msgsCopy,
    contextLength,
    functionTokens + maxTokens + TOKEN_BUFFER_FOR_SAFETY
  )

  if (systemMessage && history.length >= 2 && history[history.length - 2].role === 'system') {
    const movedSystemMessage = history.splice(-2, 1)[0]
    history.unshift(movedSystemMessage)
  }

  const flattenedHistory = flattenMessages(history)

  return flattenedHistory
}
