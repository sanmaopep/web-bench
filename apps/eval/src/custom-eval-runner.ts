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
