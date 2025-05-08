import { LineChart } from './LineChart'
import { ChartConfig } from './util'

export class ScatterChart extends LineChart {
  /**
   * @param {ChartConfig} config
   */
  constructor(config) {
    super({
      ...config,
      // @ts-ignore
      options: {
        ...(config.options ?? {}),
        datasets: false,
        pointStyle: 'circle',
        dataLabels: true,
      },
    })
  }
}
