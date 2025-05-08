import { Chart } from './Chart'
import { col } from './ChartTheme'
import { Point } from './util';

export class LineChart extends Chart {
  drawDatasets() {
    const { DW, PLB } = this
    const { datasets } = this.config.data
    const lineSmooth = this.config.options?.lineSmooth

    if (this.isDatasetsHidden) return ''

    const datasetsHtml = datasets
      .map((d, i) => {
        const c = col(i)
        if (lineSmooth) {
          const p0 = { x: PLB.x, y: this.getY(d.data[0]) }
          const p1 = { x: PLB.x + DW, y: this.getY(d.data[1]) }
          const c01 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 }
          const points = d.data
            .slice(2)
            .map((v, j) => `T ${PLB.x + DW * (j + 2)} ${this.getY(v)}`)
            .join(' ')
          const d1 = `M ${p0.x} ${p0.y} Q ${c01.x} ${c01.y} ${p1.x} ${p1.y} ${points}`

          return `<path class="dataset dataset-${i}" style="stroke:${c};" d="${d1}" />`
        } else {
          const points = d.data.map((v, j) => `${PLB.x + DW * j} ${this.getY(v)}`).join(',')

          return `<polyline class="dataset dataset-${i}" style="stroke:${c};" title="${d.label}" points="${points}" />`
        }
      })
      .join('')

    return `<g class="datasets">${datasetsHtml}</g>`
  }

  drawPoints() {
    const { DW, PLB } = this
    const { datasets } = this.config.data
    const pointStyle = this.config.options?.pointStyle

    if (!pointStyle) return ''

    const S = 0.3

    const pointsHtml = datasets
      .map((d, i) => {
        const c = col(i)
        return `<g class="points points-${i}">${d.data
          .map((v, j) => {
            if (pointStyle === 'circle') {
              return `<circle class="point point-${j}" r="${S}" cx="${PLB.x + DW * j}" cy="${this.getY(
                v
              )}" style="stroke:${c};fill:${c};" />`
            } else if (pointStyle === 'rect') {
              return `<rect class="point point-${j}" width="${S * 2}" height="${S * 2}" x="${
                PLB.x + DW * j - S
              }" y="${this.getY(v) - S}" style="stroke:${c};fill:${c};" />`
            }
          })
          .join('')}</g>`
      })
      .join('')

    return `${pointsHtml}`
  }

  drawDataLabels() {
    const { DW, PLB } = this
    const { datasets } = this.config.data
    const dataLabels = this.config.options?.dataLabels

    if (!dataLabels) return ''

    const dataLabelsHtml = datasets
      .map((d, i) => {
        const c = col(i)
        return `<g class="dataLabels dataLabels-${i}">${d.data
          .map((v, j) => {
            return `<text class="dataLabel dataLabel-${j}" x="${PLB.x + DW * j}" y="${
              this.getY(v) - 1.5
            }" style="stroke:${c};fill:${c};text-anchor:${
              j === 0 ? 'start' : j === d.data.length - 1 ? 'end' : 'middle'
            }" >${v}</text>`
          })
          .join('')}</g>`
      })
      .join('')

    return `${dataLabelsHtml}`
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
