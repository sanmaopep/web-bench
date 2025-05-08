import { OpenAILLM } from './openai'

export class OpenRouter extends OpenAILLM {
  provider = 'openrouter'

  useLegacyCompletionsEndpoint = false
}
