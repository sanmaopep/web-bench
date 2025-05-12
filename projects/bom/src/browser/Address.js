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
