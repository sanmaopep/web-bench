import { EvalPlugin, EvaluatorConfig } from '@web-bench/evaluator-types'
import { ReportPlugin } from './reporter'
import { BenchProjectPlugin } from './bench'
import { BasePlugin } from './base'
import { CustomProjectPlugin } from './custom'

const InternalPlugins = [BasePlugin, BenchProjectPlugin, ReportPlugin, CustomProjectPlugin]

export const getDefaultPlugins = (projectType: EvaluatorConfig['projectType']): EvalPlugin[][] => {
  if (projectType === 'bench') {
    return [BasePlugin, BenchProjectPlugin, ReportPlugin]
  }
  return [BasePlugin, CustomProjectPlugin]
}

export const getInternalPluginsByName = (name: string): EvalPlugin[] => {
  return InternalPlugins.flat().filter((v) => v.name === name)
}
