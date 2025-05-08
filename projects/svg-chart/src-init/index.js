import { configs } from './assets/data.js'
import { LineChart } from './common/LineChart.js'

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.querySelector('.root')
  if (!root) return

  const keys = []
  for (const key in configs) {
    if (Object.prototype.hasOwnProperty.call(configs, key)) {
      keys.push(key)
    }
  }

  for await (const key of keys) {
    const config = configs[key]
    config.id = key
    // console.log({ key, config })

    let chart
    switch (config.type) {
      case 'line':
        chart = new LineChart(config)
        break

      default:
        break
    }
  }
})
