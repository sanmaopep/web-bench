// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Browser } from './Browser.js'
import { BrowserComp } from './BrowserComp.js'

export class Setting extends BrowserComp {
  bindEvents() {
    this.bindReadingTime()
    this.bindTheme()
    this.bindNetwork()
    this.bindGeolocation()
    this.bindFullscreen()
  }

  bindFullscreen() {
    const { content } = this.browser

    this.fullscreen.addEventListener('click', () => {
        content.iframe.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`)
        })
        
        const contentDocument = content.window.document
        const exitButton = contentDocument.createElement('button')
        exitButton.className = 'exit-fullscreen'
        Object.assign(exitButton.style, { position: 'fixed', right: '48px', top: '8px' })
        exitButton.innerHTML = '✕'
        exitButton.addEventListener('click', () => {
          document.exitFullscreen()
          exitButton.remove()
        })
        contentDocument.body.append(exitButton)
    })
  }

  bindGeolocation() {
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        if (this.checkReached(pos.coords)) {
          // console.log('Congratulations, you reached the target')
          navigator.geolocation.clearWatch(id)
        }
      },
      (err) => console.warn(`ERROR(${err.code}): ${err.message}`),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
    )

    navigator.geolocation.getCurrentPosition((pos) => this.checkReached(pos.coords))
  }

  checkReached(coords) {
    const target = { latitude: 30, longitude: 120 }
    let isReached = target.latitude === coords.latitude && target.longitude === coords.longitude
    this.geolocation.className = `geolocation ${isReached ? 'reached' : ''}`

    return isReached
  }

  bindNetwork() {
    this.changeNetwork(navigator.onLine)
    window.addEventListener('online', () => this.changeNetwork(true))
    window.addEventListener('offline', () => this.changeNetwork(false))
  }

  changeNetwork(online) {
    this.network.className = `network ${online ? 'online' : ''}`
  }

  bindReadingTime() {
    const { content } = this.browser

    let readingDuration = 0
    let readingTimer
    let readingUrl = ''

    content.on('urlchange', (_url) => {
      readingUrl = _url
      const url = new URL(_url)
      // this.address.setAttribute('data-log', _url)
      // console.log('[Setting]', { _url, url })

      if (readingTimer) clearInterval(readingTimer)
      readingDuration = 0
      this.readingTime.innerHTML = '0'
      readingTimer = setInterval(() => {
        if (document.hidden) return

        readingDuration += 0.1
        this.readingTime.innerHTML = `${readingDuration.toFixed(1)}s`
      }, 100)
    })
  }

  bindTheme() {
    const { content } = this.browser

    this.theme.addEventListener('change', this.onChangeTheme.bind(this))

    content.on('urlchange', (url) => {
      console.log('[Setting] urlchange', url)
      this.onChangeTheme()
    })
  }

  onChangeTheme() {
    const { content } = this.browser
    const theme = this.theme.value.toLowerCase()
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)

    setTimeout(() => {
      const contentBody = content.window.document.body
      console.log('[Setting]', { contentBody, theme })
      contentBody.classList.remove('light', 'dark')
      contentBody.classList.add(theme)

      // @ts-ignore
      const newWindows = content.window.newWindows
      if (newWindows) {
        // console.log(newWindow)
        newWindows.forEach((w) => w.postMessage({ theme }))
      }
    }, 10)
  }

  /** @returns {HTMLElement} */
  get setting() {
    // @ts-ignore
    return document.querySelector('.setting')
  }

  /** @returns {HTMLElement} */
  get readingTime() {
    // @ts-ignore
    return this.setting.querySelector('.reading-time')
  }

  /** @returns {HTMLSelectElement} */
  get theme() {
    // @ts-ignore
    return this.setting.querySelector('.theme')
  }

  /** @returns {HTMLElement} */
  get network() {
    // @ts-ignore
    return this.setting.querySelector('.network')
  }

  /** @returns {HTMLElement} */
  get geolocation() {
    // @ts-ignore
    return this.setting.querySelector('.geolocation')
  }

  /** @returns {HTMLButtonElement} */
  get fullscreen() {
    // @ts-ignore
    return this.setting.querySelector('.fullscreen')
  }
}
