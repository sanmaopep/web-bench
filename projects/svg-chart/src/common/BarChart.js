import { ChartConfig, Point } from './util'
import { Chart } from './Chart'
import { col } from './ChartTheme'

export class BarChart extends Chart {
  PADDING = 1
  MARGIN = 4

  /**
   * @param {ChartConfig} config
   */
  constructor(config) {
    super({
      ...config,
      // @ts-ignore
      options: {
        ...(config.options ?? {}),
        datasets: true,
        pointStyle: '',
        gridXCount: config.data.datasets[0].data.length,
      },
    })
  }

  drawXAxes() {
    const { H, DW, PAD, PLB, PRB } = this
    const { labels } = this.config.data

    if (this.isAxesHidden) return ''

    const xLabels = labels
      .map(
        (label, i) =>
          `<text x="${PLB.x + DW * i + DW / 2}" y="${
            H - PAD.b / 2
          }" text-anchor="middle">${label}</text>`
      )
      .join('')

    return `
<g class="axes">
  <polyline class="axis axis-x" points="${PLB.x} ${PLB.y}, ${PRB.x} ${PRB.y}" />
  ${xLabels}
</g>`
  }

  drawDatasets() {
    const { DW, PLB, PADDING, MARGIN } = this
    const { datasets } = this.config.data
    const dw = (DW - MARGIN) / datasets.length - PADDING

    const datasetsHtml = datasets
      .map((d, i) => {
        const c = col(i)
        const rectsHtml = d.data
          .map((v, j) => {
            const x = PLB.x + DW * j + (dw + PADDING) * i
            const y = this.getY(v)
            const h = this.getHeight(v)
            return `<rect class="bar bar-${j}" style="fill:${c};opacity:0.8" x="${x}" y="${y}" width="${dw}" height="${h}" /> `
          })
          .join('')

        return `<g class="dataset dataset-${i}">${rectsHtml}</g>`
      })
      .join('')

    return `<g class="datasets">${datasetsHtml}</g>`
  }

  drawDataLabels() {
    const { DW, PLB, PADDING, MARGIN } = this
    const { datasets } = this.config.data
    const dw = (DW - MARGIN) / datasets.length - PADDING
    const dataLabels = this.config.options?.dataLabels

    if (!dataLabels) return ''

    const dataLabelsHtml = datasets
      .map((d, i) => {
        const c = col(i)
        return `<g class="dataLabels dataLabels-${i}">${d.data
          .map((v, j) => {
            const x = PLB.x + DW * j + (dw + PADDING) * i + dw / 2
            const y = this.getY(v) - 1
            return `<text class="dataLabel dataLabel-${j}" x="${x}" y="${y}" style="stroke:${c}; fill:${c}; text-anchor:middle;" >${v}</text>`
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

    const index = Math.floor((x - PLB.x) / DW)
    // console.log({ x, DW, index })
    return index
  }
}
