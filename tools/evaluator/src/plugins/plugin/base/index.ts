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
