import { Browser } from './Browser.js'
import { BrowserComp } from './BrowserComp.js'
import { iframeURLChange } from './util.js'

export class Content extends BrowserComp {
  bindEvents() {
    // this.iframe.contentWindow?.navigation.addEventListener('navigate', (ev) => {
    //   console.log('[Content] iframe.navigate', ev.type, ev)
    //   // this.emit('urlchange', url)
    // })

    iframeURLChange(this.iframe, (url) => {
      console.log('Content.iframeURLChange', url)
      // console.log(this.navigation.entries())
      this.emit('urlchange', url)
    })
  }

  /**
   * @param {string} url
   */
  go(url) {
    this.iframe.src = url
  }

  /** @returns {HTMLIFrameElement} */
  get iframe() {
    // @ts-ignore
    return document.querySelector('.content')
  }

  /** @returns {WindowProxy} */
  get window() {
    // @ts-ignore
    return this.iframe.contentWindow
  }

  /** @returns {any} */
  get navigation() {
    // @ts-ignore
    return this.window.navigation
  }
}
