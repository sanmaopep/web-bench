import stripAnsi from 'strip-ansi'
import child_process from 'child_process'
import { filterNumberStartString } from '../../utils/string'
import { clearErrorMsg } from '../../utils/error'
import { IProjectRunner } from '@web-bench/evaluator-types'

export class Builder {
  public project: IProjectRunner
  constructor(project: IProjectRunner) {
    this.project = project
  }

  public build = (): Promise<string> => {
    const {
      settings: { projectDir, outputProjectDir, repositoryDir },
      currentTask,
    } = this.project

    const {
      project: { logger },
    } = this
    return new Promise((resolve) => {
      logger.debug('excute build', `cd ${projectDir} && npm run build`)

      child_process.exec(
        `cd ${projectDir} && npm run build`,
        {
          env: {
            ...process.env,
            EVAL_PROJECT_ROOT: outputProjectDir[0],
            EVAL_TASK: currentTask?.task.id,

            EVAL: 'true',
          },
        },
        (err, stdout, stderr) => {
          logger.silentLog('stdout', stdout)
          logger.debug('stderr', stderr)
          logger.silentLog('error', err)

          if (!err) {
            return resolve('')
          }

          let outputData: string = stderr?.toString()

          if (outputData) {
            outputData = stripAnsi(outputData)

            outputData = outputData
              .split('\n')
              // 过滤掉  playwright 输出后就会清理的日志
              .filter((v) => !filterNumberStartString(v) && !v.startsWith('<'))
              .join('\n')

            outputData = clearErrorMsg(outputData, [
              'src/',
              outputProjectDir[0],
              projectDir,
              repositoryDir,
            ])!

            console.log('outputData', outputData)

            resolve(outputData)
          }
          resolve(stderr)
        }
      )
    })
  }
}
