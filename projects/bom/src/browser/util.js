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

/**
 * @see https://gist.github.com/hdodov/a87c097216718655ead6cf2969b0dcfa
 * @param {HTMLIFrameElement} iframe 
 * @param {any} callback 
 */
export function iframeURLChange(iframe, callback) {
  var lastDispatched = null

  var dispatchChange = function () {
    var newHref = iframe.contentWindow?.location.href

    if (newHref !== lastDispatched) {
      callback(newHref)
      lastDispatched = newHref
    }
  }

  var unloadHandler = function () {
    // Timeout needed because the URL changes immediately after
    // the `unload` event is dispatched.
    setTimeout(dispatchChange, 0)
  }

  function attachUnload() {
    // Remove the unloadHandler in case it was already attached.
    // Otherwise, there will be two handlers, which is unnecessary.
    iframe.contentWindow?.removeEventListener('unload', unloadHandler)
    iframe.contentWindow?.addEventListener('unload', unloadHandler)
  }

  iframe.addEventListener('load', function () {
    attachUnload()

    // Just in case the change wasn't dispatched during the unload event...
    dispatchChange()
  })

  attachUnload()
}

export class EventEmitter {
  constructor() {
    this.events = new Map()
  }

  /**
   * @param {string} event
   * @param {any} callback
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event).push(callback)
    return this
  }

  /**
   * @param {string} event
   * @param {any[]} args
   */
  emit(event, ...args) {
    if (!this.events.has(event)) {
      return false
    }

    this.events.get(event).forEach((callback) => {
      callback.apply(this, args)
    })
    return true
  }

  /**
   * @param {string} event
   * @param {any} callback
   */
  once(event, callback) {
    const wrapper = (...args) => {
      callback.apply(this, args)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }

  /**
   * @param {string} event
   * @param {any} callback
   */
  off(event, callback) {
    if (!this.events.has(event)) {
      return this
    }

    if (!callback) {
      this.events.delete(event)
      return this
    }

    const listeners = this.events.get(event)
    const filteredListeners = listeners.filter((cb) => cb !== callback)

    if (filteredListeners.length) {
      this.events.set(event, filteredListeners)
    } else {
      this.events.delete(event)
    }

    return this
  }

  listenerCount(event) {
    if (!this.events.has(event)) {
      return 0
    }
    return this.events.get(event).length
  }

  rawListeners(event) {
    return this.events.get(event) || []
  }
}

// // Usage example:
// const emitter = new EventEmitter();

// emitter.on('test', (data) => {
//   console.log('test event fired:', data);
// });

// emitter.once('once', (data) => {
//   console.log('once event fired:', data);
// });

// emitter.emit('test', 'hello world'); // logs: test event fired: hello world
// emitter.emit('once', 'first time'); // logs: once event fired: first time
// emitter.emit('once', 'second time'); // nothing happens

// console.log(emitter.listenerCount('test')); // 1
// console.log(emitter.listenerCount('once')); // 0
