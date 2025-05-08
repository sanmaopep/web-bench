import { ChartConfig } from './util'
import { Chart } from './Chart'
import { PieChart } from './PieChart'

export class DoughnutChart extends PieChart {
  onAfterDraw() {
    super.onAfterDraw()

    this.svg.querySelector('.dataset')?.setAttribute('mask', 'url(assets/res.svg#circleMask)')
    // this.svg.querySelectorAll('.sector')?.forEach((el) => {
    //   el.setAttribute('mask', 'url(assets/res.svg#circleMask)')
    // })
  }
}
