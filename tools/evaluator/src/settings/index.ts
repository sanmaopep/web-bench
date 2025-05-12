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
 * 获取完整项目配置，这里用 getter 实现是因为
 * 应该有两种模式
 * 1. clone bench 仓库，然后直接获取 projects 下的 project 的模式
 * 2. 在已有项目里安装 evaluator 包，然后执行，这种的 project 获取方式还没有想好 XD，但是肯定模式 1 不一样
 * 所以需要一个 getter 来处理这两种情况
 * 2024.11.08 只支持模式 1
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
