export interface CompletionOptions {
  temperature?: number
  topP?: number
  topK?: number
  minP?: number
  presencePenalty?: number
  frequencyPenalty?: number
  mirostat?: number
  stop?: string[]
  maxTokens?: number
  numThreads?: number
  keepAlive?: number
  model: string
  raw?: boolean
  stream?: boolean
}
