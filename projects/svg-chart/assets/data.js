export const data = {
  labels: ['2025.1.1', '2025.1.2', '2025.1.3', '2025.1.4', '2025.1.5'],
  datasets: [
    { label: 'Pass@2', data: [20.0, 30.0, 35.0, 30.0, 40.0] },
    { label: 'Pass@1', data: [10.0, 15.0, 25.0, 20.0, 30.0] },
    { label: 'Error@1', data: [5.0, 6.0, 4.0, 8.0, 7.0] },
  ],
}

export const configs = {
  // Basic Lines
  line: { type: 'line', data, options: { legends: false, grids: false, axes: false } },
  lineAxes: { type: 'line', data, options: { legends: false, grids: false } },
  lineAxesGrids: { type: 'line', data, options: { legends: false } },
  lineAxesGridsLegends: { type: 'line', data, options: {} },
  // Line Configs
  linePointsCircle: { type: 'line', data, options: { pointStyle: 'circle' } }, // 'circle' | 'rect'
  linePointsRect: { type: 'line', data, options: { pointStyle: 'rect' } },
  lineDataLabels: { type: 'line', data, options: { dataLabels: true } },
  lineFull: {
    type: 'line',
    data,
    options: { axesArrows: true, pointStyle: 'circle', dataLabels: true },
  },
  lineSmoothFull: {
    type: 'line',
    data,
    options: { lineSmooth: true, axesArrows: true, pointStyle: 'circle', dataLabels: true },
  },
  // More Charts
  scatter: { type: 'scatter', data, options: { pointStyle: 'circle', dataLabels: true } },
  step: { type: 'step', data, options: { pointStyle: 'circle', dataLabels: true } },
  area: { type: 'area', data, options: { pointStyle: 'circle', dataLabels: true } },
  bar: { type: 'bar', data, options: { dataLabels: true } },
  pie: { type: 'pie', data, options: { dataLabels: true } },
}
