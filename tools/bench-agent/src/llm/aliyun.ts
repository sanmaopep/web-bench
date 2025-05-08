import { ScheduleTask } from '../type'
import { LLMOption } from './base'
import { OpenAILLM } from './openai'

/**
 * Visit https://bailian.console.aliyun.com/#/model-market to get more models.
 */
export class Aliyun extends OpenAILLM {
  provider = 'aliyun'

  option: LLMOption = {
    contextLength: 10_000,
    maxTokens: 1024 * 4,
    apiBase: 'https://dashscope.aliyuncs.com/compatible-mode/v1/',
  }

  public checkLimit: (_: { runningTask: ScheduleTask[] }) => boolean = ({ runningTask }) => {
    return runningTask.length < 10
  }
}
