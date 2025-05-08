import { configs } from './assets/data.js'
import { Chart } from './common/Chart.js'

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.querySelector('.root')
  if (!root) return

  const keys = []
  for (const key in configs) {
    if (Object.prototype.hasOwnProperty.call(configs, key)) {
      keys.push(key)
    }
  }
  // keys.reverse()

  for await (const key of keys) {
    const config = configs[key]
    const chart = await Chart.create({ ...config, id: key })
    chart.draw()
    root.append(chart.svg)
  }
})
