import { Browser } from './Browser.js'
import { EventEmitter } from './util.js'

export class BrowserComp extends EventEmitter {
  /** @type {Browser} */
  browser

  /**
   * @param {Browser} browser
   */
  constructor(browser) {
    super()

    this.browser = browser

    this.bindEvents()
  }

  bindEvents() {
    throw new Error('NOT IMPLEMENT!')
  }
}
