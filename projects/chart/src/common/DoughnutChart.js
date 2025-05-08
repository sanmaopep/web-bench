import { PieChart } from './PieChart'

export class DoughnutChart extends PieChart {
  onAfterDraw() {
    super.onAfterDraw()

    this.svg.querySelector('.dataset')?.setAttribute('mask', 'url(assets/res.svg#circleMask)')
  }
}
