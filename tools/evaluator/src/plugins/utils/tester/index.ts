import { IProjectRunner } from '@web-bench/evaluator-types'
import PlaywrightTester from './playwright'
import { CodeTester } from './type'

export class TesterFactory {
  static createTester(provider: string, runner: IProjectRunner): CodeTester {
    switch (provider) {
      case 'playwright': {
        return new PlaywrightTester(runner)
      }
      default:
        throw Error(`Unknown provider ${provider}`)
    }
  }
}
