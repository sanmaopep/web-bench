import fs from 'promise-fs'
import { EvaluatorConfig, IAgent, Model } from '@web-bench/evaluator-types'
import JSON5 from 'json5'
import path from 'path'

import { BenchAgent } from '@web-bench/bench-agent'
import { HttpAgent } from '@web-bench/http-agent'
import { loadEnvForModels } from './utils/env'
import { getStableProject } from './utils/project'

export interface BenchEvalInitConfig extends EvaluatorConfig {
  models: string[]

  temperature?: number
}

// init bench agent
export const getAgents = async (config: BenchEvalInitConfig): Promise<IAgent[]> => {
  const modelPath = path.join(__dirname, '../src', 'model.json')

  const { models, agentMode, agentEndPoint } = config

  switch (agentMode) {
    case 'http': {
      if (!agentEndPoint) {
        throw new Error('Endpoint must be provided for http agents')
      }
      return [new HttpAgent(agentEndPoint)]
    }

    default: {
      const modelConfig = JSON5.parse(
        await fs.readFile(path.join(modelPath), {
          encoding: 'utf-8',
        })
      ) as { models: Model[] }

      modelConfig.models = loadEnvForModels(modelConfig.models)

      const usedModels = new Set(models)

      return modelConfig.models
        .filter((model) => usedModels.has(model.title || model.model))
        .map(
          (model) =>
            new BenchAgent(model, {
              temperature: config.temperature,
            })
        )
    }
  }
}

export const getEvaluatorConfig = async (
  initConfig: Partial<EvaluatorConfig>
): Promise<BenchEvalInitConfig> => {
  // init evaluation runner
  const configPath = path.join(__dirname, '../src', 'config.json5')
  // Generate default config
  if (!fs.existsSync(configPath)) {
    const defaultConfig = {
      models: ['claude-3-5-sonnet-20241022'],
    }
    fs.writeFileSync(configPath, JSON5.stringify(defaultConfig, null, 2), 'utf-8')
  }

  const localConfig = JSON5.parse(
    fs
      .readFileSync(path.join(configPath), {
        encoding: 'utf-8',
      })
      .toString()
  ) as BenchEvalInitConfig

  const EvaluatorConfig: BenchEvalInitConfig = {
    ...localConfig,
    ...initConfig,
  }

  return await fillEvaluationDefaultValue(EvaluatorConfig)
}

export const fillEvaluationDefaultValue = async (
  EvaluatorConfig: Partial<BenchEvalInitConfig>
):  Promise<BenchEvalInitConfig> => {
  if (!EvaluatorConfig.agentMode) {
    EvaluatorConfig.agentMode = 'local'
  }

  if (!EvaluatorConfig.models) {
    EvaluatorConfig.models = []
  }

  if (!EvaluatorConfig.agentDir) {
    EvaluatorConfig.agentDir = path.join(__dirname, '..')
  }

  if (!EvaluatorConfig.projects) {
    EvaluatorConfig.projects = await getStableProject()
  }
  return EvaluatorConfig as BenchEvalInitConfig
}
