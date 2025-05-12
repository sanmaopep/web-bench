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
