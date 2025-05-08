import { Shape } from './Shape.js'

export class Rectangle extends Shape {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    super()

    this.width = width
    this.height = height
  }

  get area() {
    return this.width * this.height
  }
}
