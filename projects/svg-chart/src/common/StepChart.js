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
