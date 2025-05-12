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

import { col } from './ChartTheme'
import { LineChart } from './LineChart'
import { ChartConfig, SVG_NS } from './util'

export class AreaChart extends LineChart {
  /**
   * @param {ChartConfig} config
   */
  constructor(config) {
    super({
      ...config,
      // @ts-ignore
      options: {
        ...(config.options ?? {}),
        lineSmooth: false,
        datasets: true,
      },
    })
  }

  onAfterDraw() {
    super.onAfterDraw()

    const { svg, PRB, PLB } = this
    const { datasets } = this.config.data

    /** @type {(SVGPolylineElement | SVGPathElement)[]} */
    // @ts-ignore
    const datasetEls = [...svg.querySelectorAll('.dataset')]

    let areasEl = svg.querySelector('.areas')
    if (!areasEl) {
      areasEl = document.createElementNS(SVG_NS, 'g')
      areasEl.setAttribute('class', `areas`)
      svg.insertBefore(areasEl, svg.querySelector('.datasets'))
    }

    let html = []
    for (let i = 0; i < datasetEls.length; i++) {
      const datasetEl = datasetEls[i]
      const linePoints = datasetEl.getAttribute('points')
      html.push(
        `<polygon class="area area-${i}" points="${linePoints}, ${PRB.x} ${PRB.y}, ${PLB.x} ${
          PLB.y
        }" style="fill:${col(i)}" />`
      )
      // console.log(datasetEl)
    }
    areasEl.innerHTML = html.join('')
  }
}
