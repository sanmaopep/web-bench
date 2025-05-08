import { Chart } from './Chart'
import { col } from './ChartTheme'
import { Point } from './util'

export class LineChart extends Chart {
  drawDatasets() {
    const { DW, PLB } = this
    const { datasets } = this.config.data

    if (this.isDatasetsHidden) return ''

    const datasetsHtml = datasets
      .map((d, i) => {
        const c = col(i)
        const points = d.data.map((v, j) => `${PLB.x + DW * j} ${this.getY(v)}`).join(',')

        return `<polyline class="dataset dataset-${i}" style="stroke:${c};" title="${d.label}" points="${points}" />`
      })
      .join('')

    return `<g class="datasets">${datasetsHtml}</g>`
  }

  drawPoints() {
    return ``
  }

  drawDataLabels() {
    return ``
  }

  /**
   * @param {Point} point
   * @returns {number}
   */
  getDataIndex(point) {
    const { DW, PLB } = this
    const { x, y } = point
    if (x < PLB.x || y < this.PLT.y) return -1

    const indexForHalfDW = Math.floor((x - PLB.x) / (DW / 2))
    const index = Math.floor((indexForHalfDW + 1) / 2)
    // console.log({ x, DW, index })
    return index
  }
}
