// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
        : await fillEvaluationDefaultValue(initConfig)

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
