import { Task } from '@web-bench/evaluator-types'
import { ProjectRunner } from '../project-runner'
import { DefaultTaskRunner } from './default-task-runner'

export class InitTaskRunner extends DefaultTaskRunner {
  public type = 'init' as const
  public constructor(task: Task, project: ProjectRunner) {
    const settings = project.settings
    const initFiles = settings.initFiles

    const newDescription = `${task.description}${(task.description.endsWith('\n') || task.description.trim().endsWith('.')) ? '' : '.'}
Add filename after code block.
The filename should appear on the line following the language specifier in your code block.
${initFiles.length > 0 ? `The existing files: ${settings.initFiles.join()}` : ''}`

    super(
      {
        ...task,
        description: newDescription,
        context: [],
      },
      project
    )
  }

  public async run(): Promise<boolean> {
    const res = await super.run()

    if (!res) {
      const { settings } = this.project

      this.project.updateSettings({
        ...settings,
        // init 任务都失败的话，则将最新的 输出 output 设置为 init 目录，这样下次执行时会将 init 目录内容拷贝到下一个 task 运行目录内
        outputProjectDir: [settings.initDir, ...settings.outputProjectDir],
      })
    }

    return true
  }
}
