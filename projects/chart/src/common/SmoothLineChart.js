import { LineChart } from './LineChart'
import { ChartConfig } from './util'

export class SmoothLineChart extends LineChart {
  /**
   * @param {ChartConfig} config
   */
  constructor(config) {
    super({
      ...config,
      // @ts-ignore
      options: {
        ...(config.options ?? {}),
        lineSmooth: true,
      },
    })
  }
}
