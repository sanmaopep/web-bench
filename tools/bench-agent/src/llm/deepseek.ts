import { LLMOption } from './base'
import { OpenAILLM } from './openai'

export class DeepseekLLM extends OpenAILLM {
  provider = 'deepseek'

  option: LLMOption = {
    contextLength: 10_000,
    maxTokens: 1024 * 8,
    temperature: 0,
    apiBase: 'https://openrouter.ai/api/v1/',
  }
}
