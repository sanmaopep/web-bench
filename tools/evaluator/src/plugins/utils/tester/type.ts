import { ProjectSetting, Task } from '@web-bench/evaluator-types'

export interface CodeTester {
  /**
   * provider 唯一标识
   */
  provider: string
  /**
   * 判断当前是否有该环境
   */
  exist(): Promise<boolean>

  /**
   * 执行测试代码
   */
  test(task: Task, projectSetting: ProjectSetting): Promise<string>
  /**
   * 执行截图
   */
  screenshot?(filename: string, settings: ProjectSetting): Promise<void>
}
