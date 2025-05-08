import { Browser } from './Browser.js'
import { BrowserComp } from './BrowserComp.js'

export class Address extends BrowserComp {
  bindEvents() {
    const { content } = this.browser
    content.on('urlchange', (_url) => {
      const url = new URL(_url)
      // this.address.setAttribute('data-log', _url)
      // console.log('[Address]', { _url, url })
      Array.from(this.address.options).forEach((option) => {
        if (url.pathname.includes(option.value.replace('.html', ''))) {
          this.address.value = option.value
        }
      })
    })

    this.address.addEventListener('change', this.onAddressChange.bind(this))
  }

  onAddressChange() {
    const url = this.address.value
    console.log('Address', url)
    this.browser.content.go(url)
  }

  /** @returns {HTMLSelectElement} */
  get address() {
    // @ts-ignore
    return document.querySelector('.address')
  }

  /**
   * @param {number} index
   */
  set selectedIndex(index) {
    this.address.selectedIndex = index
    this.onAddressChange()
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.address.value = value
    this.onAddressChange()
  }
}
