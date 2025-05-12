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

import { EvalPlugin, EvalPluginHook, ILogger } from '@web-bench/evaluator-types'

export class PluginSchedule {
  public plugins: EvalPlugin[] = []

  public logger?: ILogger

  constructor(plugins: EvalPlugin[] | EvalPlugin[][], logger?: ILogger) {
    this.plugins = plugins.flat()

    this.logger = logger
  }

  public async run<T extends keyof EvalPluginHook>(
    hook: T,
    ctx: Parameters<Required<EvalPluginHook>[T]>[0],
    defaultValue?: Exclude<Awaited<ReturnType<Required<EvalPluginHook>[T]>>, undefined>
  ): Promise<Exclude<Awaited<ReturnType<Required<EvalPluginHook>[T]>>, undefined>> {
    const pre: EvalPlugin[] = []

    const run: EvalPlugin[] = []

    const post: EvalPlugin[] = []

    this.plugins.forEach((plugin) => {
      if (plugin[hook]) {
        if (plugin.enforce === 'replace') {
          run.push(plugin)
        } else if (plugin.enforce === 'post') {
          post.push(plugin)
        } else {
          pre.push(plugin)
        }
      }
    })

    let res: any = defaultValue

    for (const plugin of pre) {
      res = (await plugin[hook]?.(ctx as any)) || res
    }

    res = (await run.pop()?.[hook]?.(ctx as any)) || res

    for (const plugin of post) {
      res = (await plugin[hook]?.(ctx as any)) || res
    }

    // this.logger?.debug('PluginSchedule', hook, pre, run, post)
    // this.logger?.debug('PluginSchedule Res', res)

    return res
  }
}
