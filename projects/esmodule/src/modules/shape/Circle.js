import { Shape } from './Shape.js'
import { PI, square } from '../util/math.js'

export class Circle extends Shape {
  /**
   * @param {number} radius
   */
  constructor(radius) {
    super()

    this.radius = radius
  }

  get area() {
    return PI * square(this.radius)
  }
}
