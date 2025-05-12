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

import { IProjectRunner } from '@web-bench/evaluator-types'
import PlaywrightTester from './playwright'
import { CodeTester } from './type'

export class TesterFactory {
  static createTester(provider: string, runner: IProjectRunner): CodeTester {
    switch (provider) {
      case 'playwright': {
        return new PlaywrightTester(runner)
      }
      default:
        throw Error(`Unknown provider ${provider}`)
    }
  }
}
