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
