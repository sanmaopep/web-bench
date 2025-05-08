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
