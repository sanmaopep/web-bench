export class Chart {
  /** @type {SVGElement} */
  svg
  /** @type {any} */
  config

  /**
   * @param {any} config
   */
  constructor(config) {
    this.config = config

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svg = svg
  }

  draw() {}
}
