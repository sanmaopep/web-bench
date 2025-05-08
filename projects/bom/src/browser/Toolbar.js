import { Browser } from './Browser.js'
import { BrowserComp } from './BrowserComp.js'

export class Toolbar extends BrowserComp {
  bindEvents() {
    const { content } = this.browser

    content.on('urlchange', (_url) => {
      this.update()
    })

    this.toolbar.addEventListener('click', (e) => {
      const { content, address } = this.browser

      if (!(e.target instanceof HTMLButtonElement)) return
      const classList = e.target.classList
      if (classList.contains('refresh')) {
        content.window.location.reload()
      } else if (classList.contains('back')) {
        content.window.history.back()
      } else if (classList.contains('forward')) {
        content.window.history.forward()
      } else if (classList.contains('homepage')) {
        address.selectedIndex = 0
      }

      this.update()
    })

    this.backButton.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      e.stopPropagation()

      const index = content.navigation.currentEntry.index
      /** @type {any[]} */
      const entries = content.navigation
        .entries()
        .slice(0, index)
        .map((o) => o.url)
      if (entries.length) {
        new Popup('back-menu', e.pageX, e.pageY, entries, (url) => {
          content.navigation.navigate(url)
        })
      }
    })

    this.forwardButton.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      e.stopPropagation()

      const index = content.navigation.currentEntry.index
      /** @type {any[]} */
      const entries = content.navigation
        .entries()
        .slice(index + 1)
        .reverse()
        .map((entry) => entry.url)
      if (entries.length) {
        new Popup('forward-menu', e.pageX, e.pageY, entries, (url) => {
          content.navigation.navigate(url)
        })
      }
    })
  }

  update() {
    const { content } = this.browser
    console.log('[Toolbar]', {
      entries: content.navigation.entries().map((o) => new URL(o.url).pathname),
      currentEntry: content.navigation.currentEntry.index,
    })
    this.backButton.disabled = !content.navigation.canGoBack
    this.forwardButton.disabled = !content.navigation.canGoForward
  }

  /** @returns {HTMLElement} */
  get toolbar() {
    // @ts-ignore
    return document.querySelector('.toolbar')
  }

  /** @returns {HTMLButtonElement} */
  get backButton() {
    // @ts-ignore
    return this.toolbar.querySelector('.back')
  }

  /** @returns {HTMLButtonElement} */
  get forwardButton() {
    // @ts-ignore
    return this.toolbar.querySelector('.forward')
  }

  /** @returns {HTMLButtonElement} */
  get refreshButton() {
    // @ts-ignore
    return this.toolbar.querySelector('.refresh')
  }

  /** @returns {HTMLButtonElement} */
  get homepageButton() {
    // @ts-ignore
    return this.toolbar.querySelector('.homepage')
  }
}

class Popup {
  /** @type {HTMLElement} */
  popup

  /**
   * @param {string} className
   * @param {number} x
   * @param {number} y
   * @param {string[]} urls
   * @param {(url:string)=>void} onClick
   */
  constructor(className, x, y, urls, onClick) {
    Popup.registerGlobalClose()

    const popup = document.createElement('div')
    this.popup = popup

    popup.className = `menu ${className}`
    Object.assign(popup.style, { position: 'fixed', left: `${x}px`, top: `${y}px` })
    popup.innerHTML = urls.map((url) => `<div class="menu-item">${url}</div>`).join('')
    popup.addEventListener('click', (e) => {
      if (!(e.target instanceof HTMLElement)) return

      onClick(e.target.innerHTML)
      this.close()
    })

    document.body.append(popup)
  }

  close() {
    this.popup.remove()
  }

  static _globalCloseInited = false
  static registerGlobalClose() {
    if (!Popup._globalCloseInited) Popup._globalCloseInited = true
    else return

    document.addEventListener('click', () => {
      document.querySelectorAll('.menu').forEach((el) => {
        el.remove()
      })
    })
  }
}
