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

import { EvaluatorConfig, ProjectSettingGetter } from '@web-bench/evaluator-types'
import { BenchProjectSettingGetter } from './bench'
import { PluginSchedule } from '../plugins/schedule'
import { CustomProjectSettingGetter } from './custom'
// import { CustomProjectSettingGetter } from './custom'

/**
 * Get the complete project configuration. A getter is used here because
 * there should be two modes:
 * 1. Clone the bench repository and directly get the project under projects.
 * 2. Install the evaluator package in an existing project and execute it. The project acquisition method for this mode is not yet determined XD, but it will definitely be different from mode 1.
 * Therefore, a getter is needed to handle these two situations.
 * 2024.11.08 Only mode 1 is supported.
 */
export const getInitProjectSettingGetter = (
  projectType: EvaluatorConfig['projectType'],
  hash: string,
  pluginSchedule: PluginSchedule
): ProjectSettingGetter => {
  if (projectType === 'bench') {
    return new BenchProjectSettingGetter(hash, pluginSchedule)
  }

  return new CustomProjectSettingGetter(hash, pluginSchedule)
}
