import minimist from 'minimist'
import { startServer } from './utils/server'
import { readdir, readFile, readFileSync, stat } from 'promise-fs'
import { EvaluatorConfig } from '@web-bench/evaluator-types'
import { getCmdConfigs } from './utils/cmd'
import path from 'path'
import dayjs from 'dayjs'
import 'dotenv/config'
import { compressFolder } from './utils/compress'
import { BenchEvalInitConfig } from './base'
import { BenchEvalRunner } from './bench-eval-runner'
import { getStableProject } from './utils/project'
// import { CustomEvalRunner } from './custom-eval-runner'
export { CustomEvalRunner as EvalRunner } from './custom-eval-runner'

const argv = minimist(process.argv.slice(2))
const start = async () => {
  // server 模式
  if (argv.server) {
    startServer()
  } else {
    let config: Partial<BenchEvalInitConfig> = {}
    // 使用 config 文件初始化
    if (argv.config) {
      const configFile = await readFileSync(argv.config, { encoding: 'utf-8' })
      config = {
        ...JSON.parse(configFile),
      }
    }

    if (argv['daily']) {
      config.hash = dayjs().startOf('day').format('YYYYMMDD-HHmmss')
    }

    if (argv['hash']) {
      config.hash = argv['hash']
    }

    // 使用 stable projects 初始化
    if (argv['use-stable-projects']) {
      config.projects = await getStableProject()
    }

    const cmdConfigs = getCmdConfigs()

    cmdConfigs.forEach((cmd) => {
      if (argv[cmd.cmdName]) {
        config[cmd.key as keyof EvaluatorConfig] = cmd.toValue
          ? cmd.toValue(argv[cmd.cmdName])
          : argv[cmd.cmdName]
      }
    })

    const runner = new BenchEvalRunner(config, !argv['without-local-config'])

    const hash = await runner.run()

    if (argv['zip']) {
      await compressFolder(path.join(__dirname, '../../eval/report', `eval-${hash}`))
    }
  }
}

if (argv['auto-run']) {
  start()
}
