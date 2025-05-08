import { col, getColor } from './ChartTheme'
import { ChartConfig, DENSITY, getIndexArray, getMinMaxValue, max, Point, SVG_NS } from './util'

export class Chart {
  /** @type {SVGElement} */
  svg
  /** @type {ChartConfig} */
  config

  /**
   * @param {ChartConfig} config
   */
  constructor(config) {
    this.config = config

    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.setAttribute('id', config.id)
    svg.setAttribute('class', `chart ${config.type}`)
    svg.setAttribute('viewBox', '0 0 100 70')
    // svg.setAttribute('data-config', JSON.stringify({ ...config }))
    this.svg = svg

    const {
      data: { labels, datasets },
      options,
    } = config
    const values = getMinMaxValue(datasets)
    this.isDatasetsHidden = options?.datasets === false
    this.isLegendsHidden = options?.legends === false
    this.isGridsHidden = options?.grids === false
    this.isAxesHidden = options?.axes === false

    // utils
    const LEN = (this.LEN = labels.length)
    if (LEN <= 0) throw new Error(`Data length MUST be greater than 0!`)
    const W = (this.W = 100)
    const H = (this.H = 70)
    const PAD = (this.PAD = { l: 10, r: 2, t: 10, b: 10 })
    if (this.isLegendsHidden) PAD.t = 2
    if (this.isAxesHidden) {
      PAD.l = 2
      PAD.b = 2
    }
    this.GRID_X = options?.gridXCount ?? LEN - 1 // horizontal grid rects count
    this.GRID_Y = 5 // vertical grid rects count
    this.MAX_V = values.max
    this.MIN_V = values.min
    this.PLT = { x: PAD.l, y: PAD.t } // Point Left-Top
    this.PRT = { x: W - PAD.r, y: PAD.t } // right-top
    this.PLB = { x: PAD.l, y: H - PAD.b } // left-bottom
    this.PRB = { x: W - PAD.r, y: H - PAD.b } // right-bottom
    this.DH = (H - PAD.t - PAD.b) / this.GRID_Y // grid rect height
    this.DW = (W - PAD.l - PAD.r) / this.GRID_X // grid rect width
    if (config.type === 'bar') this.DW = (W - PAD.l - PAD.r) / LEN

    this.HIDDEN = 'hidden'
    this.SELECTED = 'selected'
  }

  draw() {
    this.onBeforeDraw()

    this.svg.innerHTML = `
      ${this.drawLegends()} 
      ${this.drawXAxes()} 
      ${this.drawYAxes()} 
      ${this.drawGrids()} 
      ${this.drawDatasets()}
      ${this.drawPoints()}
      ${this.drawDataLabels()}
    `

    this.onAfterDraw()
  }

  onBeforeDraw() {}

  onAfterDraw() {
    // this.debug()
  }

  drawLegends() {
    return ``
  }

  drawGrids() {
    const { GRID_X, GRID_Y, DW, DH, PLT, PLB, PRB } = this

    if (this.isGridsHidden) return ''

    const gridXs = getIndexArray(GRID_X + 1)
      .map((i) => {
        const x = PLB.x + DW * i
        return `<polyline class="grid grid-x grid-x-${i}" points="${x} ${PLB.y}, ${x} ${PLT.y}" />`
      })
      .join('')

    const gridYs = getIndexArray(GRID_Y + 1)
      .map((i) => {
        const y = PLB.y - DH * i
        return `<polyline class="grid grid-y grid-y-${i}" points="${PLB.x} ${y}, ${PRB.x} ${y}" />`
      })
      .join('')

    return `<g class="grids">${gridXs} ${gridYs}</g>`
  }

  drawXAxes() {
    const { LEN, H, DW, PAD, PLB, PRB, config } = this
    const { labels } = config.data

    if (this.isAxesHidden) return ''

    const xLabels = labels
      .map(
        (label, i) =>
          `<text class="label label-${i}" x="${PLB.x + DW * i}" y="${H - PAD.b / 2}" text-anchor="${
            i === LEN - 1 ? 'end' : 'middle'
          }">${label}</text>`
      )
      .join('')

    const arrow = config.options?.axesArrows ? `marker-end="url(assets/res.svg#arrow)"` : ''
    return `
<g class="axes axes-x">
  <polyline class="axis axis-x" points="${PLB.x} ${PLB.y}, ${PRB.x} ${PRB.y}" ${arrow} />
  ${xLabels}
</g>`
  }

  drawYAxes() {
    const { MAX_V, MIN_V, GRID_Y, DH, PLT, PLB, config } = this
    const { labels } = config.data

    if (this.isAxesHidden) return ''

    const DV = (MAX_V - MIN_V) / GRID_Y
    const yLabels = getIndexArray(GRID_Y + 1)
      .map(
        (i) =>
          `<text class="label label-${i}" x="${PLB.x - 1}" y="${
            PLB.y - DH * i + (i === 0 ? 0 : 1)
          }" text-anchor="end">${MIN_V + DV * i}</text>`
      )
      .join('')

    const arrow = config.options?.axesArrows ? `marker-end="url(assets/res.svg#arrow)"` : ''
    return `
<g class="axes axes-y">
  <polyline class="axis axis-y" points="${PLB.x} ${PLB.y}, ${PLT.x} ${PLT.y}" ${arrow} />
  ${yLabels}
</g>`
  }

  drawDatasets() {
    return ''
    // throw new Error('NOT IMPLEMENTED!')
  }

  drawPoints() {
    return ''
    // throw new Error('NOT IMPLEMENTED!')
  }

  drawDataLabels() {
    return ''
    // throw new Error('NOT IMPLEMENTED!')
  }

  /**
   * @param {Point} point
   * @returns {number}
   */
  getDataIndex(point) {
    return -1
  }

  /**
   * @param {number} v
   */
  getY(v) {
    const { PLB } = this
    return PLB.y - this.getHeight(v)
  }

  /**
   * @param {number} v
   */
  getHeight(v) {
    const { H, MAX_V, MIN_V, PAD } = this
    const H1 = H - PAD.t - PAD.b
    return ((v - MIN_V) / (MAX_V - MIN_V)) * H1
  }

  /**
   * @param {ChartConfig} config
   * @returns {Promise<Chart>}
   */
  static async create(config) {
    const { type } = config
    const className = `${type[0].toUpperCase() + type.slice(1)}Chart`
    const ChartClass = (await import(/* @vite-ignore */ `./${className}.js`))[className]
    return new ChartClass(config)
  }
}
