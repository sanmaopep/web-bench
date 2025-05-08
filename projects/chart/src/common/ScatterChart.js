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
        pointStyle: config.options?.pointStyle ? config.options?.pointStyle : 'circle',
        dataLabels: true,
      },
    })
  }
}
