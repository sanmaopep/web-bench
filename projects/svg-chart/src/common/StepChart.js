import { col } from './ChartTheme'
import { LineChart } from './LineChart'

export class StepChart extends LineChart {
  drawDatasets() {
    const { DW, PLB } = this
    const { datasets } = this.config.data

    if (this.isDatasetsHidden) return ''

    const datasetsHtml = datasets
      .map((d, i) => {
        // let points = `${PLB.x} ${this.getY(d.data[0])}`
        const points = d.data
          .map((v, j) => {
            const y = this.getY(v)
            return `${PLB.x + DW * j - (j === 0 ? 0 : DW / 2)} ${y} ${
              PLB.x + DW * j + (j === d.data.length - 1 ? 0 : DW / 2)
            } ${y}`
          })
          .join(',')

        return `<polyline class="dataset dataset-${i}" style="stroke:${col(i)};" title="${
          d.label
        }" points="${points}" />`
      })
      .join('')

    return `<g class="datasets">${datasetsHtml}</g>`
  }
}
