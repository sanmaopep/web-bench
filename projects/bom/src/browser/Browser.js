import { Content } from './Content.js'
import { Toolbar } from './Toolbar.js'
import { Address } from './Address.js'
import { Setting } from './Setting.js'

export class Browser {
  /** @type {Content} */
  content
  /** @type {Toolbar} */
  toolbar
  /** @type {Address} */
  address
  /** @type {Setting} */
  setting

  constructor() {
    this.content = new Content(this)
    this.toolbar = new Toolbar(this)
    this.setting = new Setting(this)
    this.address = new Address(this)

    this.bindEvents()
    this.init()
  }

  bindEvents() {
    let docUrl = ''

    this.content.on('urlchange', (url) => {
      // console.log('[Browser]', { docUrl, url })
      docUrl = url
    })

    if (!localStorage.debug) {
      window.addEventListener('beforeunload', function (event) {
        if (docUrl) {
          localStorage.url = docUrl
        }

        event.preventDefault()
        event.returnValue = ''
      })
    }
  }

  init() {
    if (!localStorage.debug && localStorage.url && confirm(`NOT Load '${localStorage.url}'?`)) {
      this.content.go(localStorage.url)
    } else {
      this.address.onAddressChange()
    }

    this.setting.onChangeTheme()
  }
}
