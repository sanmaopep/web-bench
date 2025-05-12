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
