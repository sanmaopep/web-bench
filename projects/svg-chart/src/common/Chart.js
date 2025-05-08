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
      ${this.drawTooltips()}
    `

    this.onAfterDraw()
  }

  onBeforeDraw() {}

  onAfterDraw() {
    this.debug()

    this.bindLegendsEvents()
    this.bindTooltipsEvents()
  }

  bindLegendsEvents() {
    const { svg, HIDDEN } = this
    const { datasets } = this.config.data

    svg.querySelectorAll('.legend').forEach((el, i) => {
      el.addEventListener('click', () => {
        el.classList.toggle(HIDDEN)
        datasets[i].hidden = el.classList.contains(HIDDEN)
        svg.querySelector(`.dataset-${i}`)?.classList.toggle(HIDDEN)
        svg.querySelector(`.points-${i}`)?.classList.toggle(HIDDEN)
        svg.querySelector(`.dataLabels-${i}`)?.classList.toggle(HIDDEN)
        svg.querySelector(`.area-${i}`)?.classList.toggle(HIDDEN)
      })
    })
  }

  bindTooltipsEvents() {
    const { svg, HIDDEN, SELECTED } = this
    const { labels, datasets } = this.config.data

    /** @type {SVGGElement} */
    // @ts-ignore
    const tooltipsEl = svg.querySelector(`.tooltips`)
    svg.addEventListener('mouseleave', () => {
      tooltipsEl.classList.add(HIDDEN)
      svg.querySelector(`.grid-x.${SELECTED}`)?.classList.remove(SELECTED)
    })

    svg.addEventListener('mousemove', (e) => {
      const p = { x: e.offsetX / DENSITY, y: e.offsetY / DENSITY }
      // 1. check dataset
      const index = this.getDataIndex(p)

      // 2. generate content
      let visibleCount = 0
      const html = datasets
        .map((d, j) => {
          if (d.hidden) return ''
          visibleCount++
          return `
            <circle cx="2" cy="${1 + 3 * visibleCount}" fill="${getColor(j)}" />
            <text x="4" y="${1.6 + 3 * visibleCount}">${d.label}: ${d.data[index]}</text>
          `
        })
        .join('')
      const height = 3 * visibleCount + 4
      tooltipsEl.innerHTML = `<rect class="bg" rx="1" ry="1" x="0" y="0" width="20" height="${height}" /> ${html}`

      // 3. tooltipsEl style
      if (index < 0 || index > labels.length) {
        tooltipsEl.classList.add(HIDDEN)
      } else {
        tooltipsEl.classList.remove(HIDDEN)
        tooltipsEl.setAttribute('transform', `translate(${p.x + 1} ${max(0, p.y - height - 1)})`)
      }

      // 4. highlight grid
      svg.querySelector(`.grid-x.${SELECTED}`)?.classList.remove(SELECTED)
      svg.querySelector(`.grid-x-${index}`)?.classList.add(SELECTED)
    })
  }

  drawLegends() {
    const { PAD } = this
    const { datasets } = this.config.data

    if (this.isLegendsHidden) return ''

    const p0 = { x: PAD.t / 2, y: PAD.t / 2 }
    const legends = datasets
      .map(
        ({ label }, i) => `
<g class="legend legend-${i}">
  <circle cx="${p0.x + 15 * i}" cy="5" fill="${col(i)}" />
  <text x="${p0.x + 2 + 15 * i}" y="5.5">${label}</text>
</g>`
      )
      .join('')

    return `<g class="legends">${legends}</g>`
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

  drawTooltips() {
    const { DW, PLB } = this
    const { datasets } = this.config.data
    const tooltips = this.config.options?.tooltips ?? true

    if (!tooltips) return ''

    return `<g class="tooltips hidden"></g>`
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

  // TODO rm debug
  debug() {
    const { svg, config } = this
    const title = document.createElementNS(SVG_NS, 'text')
    title.textContent = `${config.id}`
    // title.textContent = `>>> ${JSON.stringify({ ...config })}`
    title.setAttribute('class', 'debug')
    title.setAttribute('x', '99')
    title.setAttribute('y', '2')
    svg.append(title)
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
