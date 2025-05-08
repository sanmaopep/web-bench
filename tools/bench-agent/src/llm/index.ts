import { Model } from '../type'
import { Aliyun } from './aliyun'
import { AnthropicLLM } from './anthropic'
import { BaseLLM } from './base'
import { DeepseekLLM } from './deepseek'
import { Doubao } from './doubao'
import { OpenAILLM } from './openai'
import { OpenRouter } from './openrouter'

export class LLMFactory {
  static createLLM(info: Model): BaseLLM {
    switch (info.provider) {
      case 'anthropic': {
        return new AnthropicLLM(info)
      }
      case 'openrouter': {
        return new OpenRouter(info)
      }
      case 'openai': {
        return new OpenAILLM(info)
      }
      case 'deepseek': {
        return new DeepseekLLM(info)
      }
      case 'doubao': {
        return new Doubao(info)
      }
      case 'aliyun': {
        return new Aliyun(info)
      }
      default:
        throw Error(`Unknown provider: ${info.provider}`)
    }
  }
}
