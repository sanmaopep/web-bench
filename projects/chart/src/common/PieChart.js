// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Chart } from './Chart'
import { col } from './ChartTheme'
import { ChartConfig, DENSITY, max, RAD } from './util'

export class PieChart extends Chart {
  /**
   * @param {ChartConfig} config
   */
  constructor(config) {
    super({
      ...config,
      // @ts-ignore
      options: {
        ...(config.options ?? {}),
        grids: false,
        axes: false,
      },
    })

    const { H, PAD, PLT, PRB } = this

    const { datasets } = this.config.data
    const dataset = (this.dataset = datasets[0])
    this.sum = dataset.data.reduce((prev, cur) => prev + cur, 0)
    this.cx = (PLT.x + PRB.x) / 2
    this.cy = (PLT.y + PRB.y) / 2
    this.r = (H - PAD.t - PAD.b - 8) / 2
  }

  drawDatasets() {
    const { cx, cy, r, dataset, sum } = this

    let angle = 0
    const datasetHtml = dataset.data
      .map((v, i) => {
        const c = col(i)
        const deltaAngle = (v / sum) * 360
        const d = this.calcSector(cx, cy, r, angle, angle + deltaAngle).pathData
        angle += deltaAngle
        return `
<path class="sector sector-${i}" style="fill:${c};" d="${d}" transform-origin="${cx} ${cy}" >
  <animateTransform attributeName="transform" type="scale" values="1.05" begin="mouseover" end="mouseout" dur="0.3s" repeatCount="indefinite"/>
</path>`
      })
      .join('')

    return `
<g class="datasets">
  <g class="dataset dataset-0">${datasetHtml}</g>
</g>`
  }

  drawLegends() {
    const { PAD } = this
    const { labels } = this.config.data

    if (this.isLegendsHidden) return ''

    const p0 = { x: PAD.t / 2, y: PAD.t / 2 }
    const legends = labels
      .map(
        (label, i) => `
<g class="legend">
  <circle cx="${p0.x + 15 * i}" cy="5" fill="${col(i)}" />
  <text x="${p0.x + 2 + 15 * i}" y="5.5">${label}</text>
</g>`
      )
      .join('')

    return `<g class="legends">${legends}</g>`
  }

  drawDataLabels() {
    const { dataset: d, cx, cy, r, sum } = this
    const dataLabels = this.config.options?.dataLabels

    if (!dataLabels) return ''

    let angle = 0
    const dataLabelsHtml = `<g class="dataLabels dataLabels-0">${d.data
      .map((v, j) => {
        const deltaAngle = (v / sum) * 360
        const per = Math.floor((v / sum) * 100)
        const s = this.calcSector(cx, cy, r, angle, angle + deltaAngle)
        const centerAngle = angle + deltaAngle / 2
        const isTextLeft = centerAngle > 90 && centerAngle < 270
        const anchor = isTextLeft ? 'end' : 'start'
        const x = s.centerX + (isTextLeft ? -10 : 10)
        const y = s.centerY

        angle += deltaAngle
        return `
        <line class="connect connect-${j}" x1="${s.centerX}" y1="${s.centerY}" x2="${
          x - 0.5
        }" y2="${y}" style="stroke-width:0.1;stroke:#aaa;" />
        <text class="dataLabel dataLabel-${j}" x="${x}" y="${y}" style="text-anchor:${anchor}">${v} (${per}%)</text>
        `
      })
      .join('')}</g>`

    return `${dataLabelsHtml}`
  }

  bindLegendsEvents() {
    const { svg, HIDDEN } = this

    svg.querySelectorAll('.legend').forEach((el, i) => {
      el.addEventListener('click', () => {
        el.classList.toggle(HIDDEN)
        svg.querySelector(`.sector-${i}`)?.classList.toggle(HIDDEN)
        svg.querySelector(`.dataLabel-${i}`)?.classList.toggle(HIDDEN)
      })
    })
  }

  bindTooltipsEvents() {
    const { svg, HIDDEN, dataset: d, sum } = this

    /** @type {SVGGElement} */
    // @ts-ignore
    const tooltipsEl = svg.querySelector(`.tooltips`)
    /** @type {SVGPathElement[]} */
    // @ts-ignore
    const sectorEls = [...svg.querySelectorAll('.sector')]

    sectorEls.forEach((sectorEl, i) => {
      sectorEl.addEventListener('mouseleave', () => {
        tooltipsEl.classList.add(HIDDEN)
      })

      sectorEl.addEventListener('mousemove', (e) => {
        const p = { x: e.offsetX / DENSITY, y: e.offsetY / DENSITY }

        // 1. generate content
        const size = 3
        const height = size + 4
        const v=  d.data[i]
        const per = Math.floor((v / sum) * 100)
        tooltipsEl.innerHTML = `
<rect class="bg" rx="1" ry="1" x="0" y="0" width="25" height="${height}" /> 
<circle cx="2" cy="${1 + size}" fill="${col(0)}" />
<text x="4" y="${1.6 + size}">${d.label}: ${v} (${per}%)</text>`

        // 2. tooltipsEl style
        tooltipsEl.classList.remove(HIDDEN)
        tooltipsEl.setAttribute('transform', `translate(${p.x + 1} ${max(0, p.y - height - 1)})`)
      })
    })
  }

  calcSector(cx, cy, r, startAngle, endAngle) {
    const x1 = cx + r * Math.cos(startAngle * RAD)
    const y1 = cy + r * Math.sin(startAngle * RAD)
    const x2 = cx + r * Math.cos(endAngle * RAD)
    const y2 = cy + r * Math.sin(endAngle * RAD)
    const centerAngle = (startAngle + endAngle) / 2
    const centerX = cx + r * Math.cos(centerAngle * RAD)
    const centerY = cy + r * Math.sin(centerAngle * RAD)

    const largeArc = endAngle - startAngle <= 180 ? 0 : 1

    return {
      pathData: `
      M ${cx},${cy}
      L ${x1},${y1}
      A ${r},${r} 0 ${largeArc},1 ${x2},${y2}
      Z`,
      x1,
      y1,
      x2,
      y2,
      centerX,
      centerY,
    }
  }
}
