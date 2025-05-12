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

import { data } from './assets/data.js'
import { Chart } from './common/Chart.js'
import { $, $All } from './common/util.js'

document.addEventListener('DOMContentLoaded', async () => {
  async function onChange(e) {
    const type = $('#type').value
    const datasets = [...$('#datasets').selectedOptions].map((s) => s.value)
    console.log({ type, datasets })
    const el = e?.target
    if (el) {
      console.log({ id: el.id, value: el.value })
      if (type === 'scatter') {
        $('#dataLabels').disabled = true
      } else {
        $('#dataLabels').disabled = false
      }

      if (type === 'pie' || type === 'doughnut') {
        $('#axes').disabled = true
        $('#grids').disabled = true
        $('#pointStyle').disabled = true
        $('#datasets').multiple = false
      } else {
        $('#axes').disabled = false
        $('#grids').disabled = false
        $('#pointStyle').disabled = false
        $('#datasets').multiple = true
      }
    }

    const config = {
      id: `${type}Chart`,
      type: type,
      data: {
        labels: data.labels,
        datasets: data.datasets.filter((d) => datasets.includes(d.label)),
      },
      options: {
        axes: $('#axes').checked,
        grids: $('#grids').checked,
        legends: $('#legends').checked,
        dataLabels: $('#dataLabels').checked,
        pointStyle: $('#pointStyle').value,
      },
    }

    // @ts-ignore
    const chart = await Chart.create(config)
    chart.draw()
    $('#chart').innerHTML = ''
    $('#chart').append(chart.svg)
  }

  console.log($All('select'))

  $All('select, input[type="checkbox"]').forEach((el) => {
    el.addEventListener('change', onChange)
  })

  onChange()
})
