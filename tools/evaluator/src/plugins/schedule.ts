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
