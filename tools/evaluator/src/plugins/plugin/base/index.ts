import { EvalPlugin } from '@web-bench/evaluator-types'
import { EvalPluginPrefix } from '../../common'
import { Environment } from '../../utils/environment'
import { Builder } from '../../utils/builder'

export const BasePlugin: EvalPlugin[] = [
  {
    name: EvalPluginPrefix + 'base',
    enforce: 'replace',
    onTaskCallAgent: async ({ project, request }) => {
      return await project.agent.request(request)
    },

    onTaskInitEnv: async ({ project }) => {
      const environment = new Environment(project)
      return await environment.init()
    },
    onTaskBuild: async ({ project }) => {
      const builder = new Builder(project)

      const buildResult = await builder.build()
      return buildResult
    },
  },
]
