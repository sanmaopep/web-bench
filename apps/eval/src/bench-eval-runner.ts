import { EvaluatorRunner } from '@web-bench/evaluator'
import {
  fillEvaluationDefaultValue,
  getAgents,
  getEvaluatorConfig,
  BenchEvalInitConfig,
} from './base'
import { HTTPLimit } from '@web-bench/http-agent'

export class BenchEvalRunner {
  private _initPromise: Promise<void> | undefined

  private evaluatorRunner: EvaluatorRunner

  constructor(initConfig: Partial<BenchEvalInitConfig>, mergeLocalConfig: boolean = true) {
    this._init(initConfig, mergeLocalConfig)
  }

  private async _init(initConfig: Partial<BenchEvalInitConfig>, mergeLocalConfig: boolean) {
    const init = async () => {
      const EvaluatorConfig = mergeLocalConfig
        ? await getEvaluatorConfig(initConfig)
        : fillEvaluationDefaultValue(initConfig)

      const agents = await getAgents(EvaluatorConfig)

      if (EvaluatorConfig.httpLimit !== undefined) {
        HTTPLimit.update(EvaluatorConfig.httpLimit)
      }

      this.evaluatorRunner = new EvaluatorRunner(
        {
          ...EvaluatorConfig,
          projectType: 'bench',
        },
        agents
      )
    }

    this._initPromise = init()

    if (this._initPromise) {
      await this._initPromise
    }

    this._initPromise = undefined
  }

  public run = async () => {
    if (this._initPromise) {
      await this._initPromise
    }

    await this.evaluatorRunner.run()

    return this.evaluatorRunner.hash
  }
}
