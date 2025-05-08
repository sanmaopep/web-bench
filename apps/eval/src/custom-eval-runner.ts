import { BenchAgent } from '@web-bench/bench-agent'
import { EvaluatorRunner } from '@web-bench/evaluator'
import { EvaluatorConfig, Model } from '@web-bench/evaluator-types'

export class CustomEvalRunner {
  private evaluatorRunner: EvaluatorRunner

  constructor(evalConfig: EvaluatorConfig, model: Model) {
    const agent = new BenchAgent(model)

    this.evaluatorRunner = new EvaluatorRunner(evalConfig, [agent])
  }

  public run = async () => {
    await this.evaluatorRunner.run()
  }
}
