import { IProjectRunner, ProjectSetting, Task } from '@web-bench/evaluator-types'
import { execa } from 'execa'
import { promiseSpawn } from '../../../utils/process'
import { CodeTester } from './type'
import { generateScreenShot } from '../../../utils/screenshot'
import { LocalPort } from '../../../utils/port'
import { getErrorMessage, prettierErrorMessage } from '../../../utils/error'
const RETRY_TIMES = 3

const EXCEED_TIME = 1000 * 10 * 60

export default class PlaywrightTester implements CodeTester {
  provider = 'playwright'

  project: IProjectRunner
  public constructor(project: IProjectRunner) {
    this.project = project
  }

  public run(projectPath: string, outputSrc: string, index: number): Promise<string> {
    const {
      project: { logger, settings, currentTask },
      
    } = this
    return new Promise(async (resolve) => {
      logger.debug('excute test', `cd ${projectPath} && npm run test -- ${index}`)

      const port = LocalPort.applyPort()

      try {
        const { stderr, exitCode } = await execa({
          stdout: ['pipe'],
          stderr: ['pipe'],
          cwd: projectPath,
          // 设置超时 10min，避免出现卡死的情况
          timeout: EXCEED_TIME,
          env: {
            ...process.env,
            EVAL_PROJECT_ROOT: outputSrc,
            EVAL_TASK: currentTask?.task.id,
            EVAL_PROJECT_PORT: `${port}`,
            IS_EVAL_PRODUCTION: settings.production ? 'true' : undefined,
            EVAL: 'true',
            FORCE_COLOR: 'true',
          },
        })`npm run test -- ${index}`

        if (exitCode === 0) {
          resolve('')
          return
        }
        resolve(stderr.toString())
      } catch (err: unknown) {
        if (!err) {
          return resolve('')
        }

        if ((err as { timedOut: boolean }).timedOut) {
          resolve('Test execution timed out. Check for infinite loops or high code complexity.')
          LocalPort.releasePort(port)
          return
        }

        logger.silentLog('test error stderr', getErrorMessage(err))
        logger.silentLog('test error stdout', (err as { stdout: string })?.stdout)

        const outputData = prettierErrorMessage(
          (err as { stdout: string })?.stdout || getErrorMessage(err)
        )
        logger.info(outputData)
        resolve(outputData || '')
      } finally {
        LocalPort.releasePort(port)
      }
    })
  }

  async test(task: Task, settings: ProjectSetting): Promise<string> {
    let res: string | null = ''
    // 判断端口占用这个操作是相对耗时的且端口重复占用为小概率事件
    // 所以每次启动时假设端口没有被占用，当发现端口被占用后再重试，减少整体耗时
    for (let i = 0; i < RETRY_TIMES; i++) {
      res = await this.run(settings.projectDir, settings.outputProjectDir[0], task.index)

      if (res.indexOf('config.webServer') === -1 && res.indexOf('net::ERR_ABORTED') === -1) {
        return res
      }
    }
    return res
  }

  async screenshot(filename: string, settings: ProjectSetting): Promise<void> {
    // 判断端口占用这个操作是相对耗时的且端口重复占用为小概率事件
    // 所以每次启动时假设端口没有被占用，当发现端口被占用后再重试，减少整体耗时
    for (let i = 0; i < RETRY_TIMES; i++) {
      const port = LocalPort.applyPort()
      const res = await generateScreenShot(filename, settings, port)
      LocalPort.releasePort(port)
      this.project.logger.debug('screenshot error', res)
      if (!res || (res?.indexOf('config.webServer') === -1 && res.indexOf('net::ERR_ABORTED'))) {
        return
      }
    }
  }

  async exist(): Promise<boolean> {
    const res = await promiseSpawn('npx', ['playwright', '--version'], {})
    return !res
  }
}
