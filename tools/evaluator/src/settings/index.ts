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
