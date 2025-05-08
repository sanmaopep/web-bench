import {
  EvaluatorConfig,
  IAgent,
  ProjectConfig,
  IRunner,
  IProjectRunner,
} from '@web-bench/evaluator-types'
import dayjs from 'dayjs'
import { omit } from 'lodash'
import { ProjectRunner } from './project-runner'
import asyncPool from 'tiny-async-pool'
import { PluginSchedule } from '../plugins/schedule'
import { getDefaultPlugins, getInternalPluginsByName } from '../plugins/plugin'
export class EvaluatorRunner implements IRunner {
  public agents: IAgent[]

  _config: EvaluatorConfig

  public hash: string = ''

  public projects: IProjectRunner[] = []

  public pluginSchedule: PluginSchedule

  public constructor(config: EvaluatorConfig, agent: IAgent | IAgent[]) {
    this._config = config
    this.agents = Array.isArray(agent) ? agent : [agent]

    const plugins = (config.plugins || [])
      .map((v) => (typeof v === 'string' ? getInternalPluginsByName(v) : v))
      .flat()

    this.pluginSchedule = new PluginSchedule([...getDefaultPlugins(config.projectType), plugins])
  }

  public async run() {
    let config = this._config

    config = await this.pluginSchedule.run('onInitConfig', { config }, config)

    const { agentEndPoint, maxdop = 30, hash = dayjs().format('YYYYMMDD-HHmmss') } = config

    this.hash = hash

    await this.pluginSchedule.run('onEvalStart', { config, hash })

    // 3. 执行 project eval，最大并行执行 maxdop 个 project
    const projectsList: IProjectRunner[] = []

    config.projects?.forEach((packageName) => {
      this.agents.forEach(async (originAgent) => {
        const agent = originAgent.clone ? originAgent.clone() : originAgent

        const projectConfig: ProjectConfig = {
          packageName,
          model: agent.model?.title,
          endpoint: agentEndPoint,
          ...omit(config, ['projects']),
        }
        const project = new ProjectRunner(projectConfig, hash, agent)

        projectsList.push(project)
      })
    })

    this.projects = projectsList

    const poolRes = await asyncPool(maxdop, projectsList, async (project) => {
      await project.run()

      return project
    })

    for await (const _ of poolRes) {
    }

    await this.pluginSchedule.run('onEvalEnd', {
      config,
      hash,
      projects: projectsList,
      agents: this.agents,
    })
  }
}
