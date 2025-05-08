export class Question {
  name = ''
  preview = false
  /** @type {HTMLElement} */
  root
  /** @type {HTMLElement} */
  titleEl
  /** @type {HTMLElement} */
  bodyEl
  /** @type {HTMLElement} */
  configEl
  /** @type {(q:Question)=>void | undefined} */
  onRemove
  /** @type {(q:Question, x:number, y:number)=>void | undefined} */
  onAppend
  /** @type {(q:Question)=>void | undefined} */
  onTitleChange

  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   */
  constructor(title, name, preview) {
    this.name = name
    this.preview = preview

    const root = document.createElement('fieldset')
    this.root = root
    root.classList.add('q')
    root.classList.add(this.constructor.name)
    if (preview) root.classList.add('pre') // .preview is a button
    root.id = name
    root.innerHTML = `
    <legend class="q-title">${title}</legend>
    <div class="q-body"></div>
    <div class="q-config">
    <div class="q-config-left"></div>
    <div class="q-config-center">
      <button type="button" class="add">+ Add</button>
    </div>
    <div class="q-config-right"></div>
    </div>
    `

    // @ts-ignore
    this.titleEl = root.querySelector('.q-title')
    // @ts-ignore
    this.bodyEl = root.querySelector('.q-body')
    // @ts-ignore
    this.configEl = root.querySelector('.q-config')
    root.querySelector('.add')?.addEventListener('click', (e) => {
      e.stopPropagation()
      // @ts-ignore
      this.onAppend?.(this, e.pageX, e.pageY)
    })

    if (!preview) {
      this.setEditable(this.titleEl, () => {
        this.onTitleChange?.(this)
      })
      this.removeQuestionButton = this.addConfigButton({
        label: '🗑️',
        className: 'q-remove',
        onClick: () => {
          this.root.remove()
          this.onRemove?.(this)
        },
      })
    }
  }

  get title() {
    return this.titleEl.innerText
  }

  /** @param {HTMLElement[]} contentEls */
  set contentEls(contentEls) {
    const bodyEl = this.bodyEl
    ;[...bodyEl.children].forEach((child) => child.remove())
    contentEls.forEach((el) => bodyEl.append(el))
  }

  //////////////////////////////////////////////////////////////////////////////

  /**
   * @param {HTMLElement} el
   * @param {()=>void} [onChange]
   */
  setEditable(el, onChange) {
    el.addEventListener('click', (e) => {
      el.setAttribute('contenteditable', 'true')
      el.focus()
    })
    el.addEventListener('blur', (e) => {
      el.setAttribute('contenteditable', 'false')
    })
    el.addEventListener('keyup', (e) => {
      e.stopPropagation()
      if (e.key === 'Escape') el.setAttribute('contenteditable', 'false')
      else {
        // console.log('keyup', e.key)
        onChange?.()
      }
    })
  }

  //////////////////////////////////////////////////////////////////////////////
  /**
   * @param {object} options
   * @param {string} options.label
   * @param {string} options.className
   * @param {boolean} [options.leftside]
   * @param {(checked: boolean) => void} options.onChange
   * @returns {HTMLInputElement}
   */
  addConfigCheckbox(options) {
    const label = document.createElement('label')
    const checkbox = document.createElement('input')
    this.insertConfigElement({ el: label, leftside: options.leftside })

    label.append(checkbox)
    label.append(document.createTextNode(options.label))

    checkbox.classList.add(options.className)
    checkbox.type = 'checkbox'
    checkbox.addEventListener('change', () => options.onChange(checkbox.checked))

    return checkbox
  }

  /**
   * @param {object} options
   * @param {string} options.label
   * @param {string} options.className
   * @param {number} [options.min]
   * @param {number} [options.max]
   * @param {boolean} [options.leftside]
   * @param {(value: number) => void} options.onChange
   * @returns {HTMLInputElement}
   */
  addConfigNumberInput(options) {
    const label = document.createElement('label')
    const input = document.createElement('input')
    this.insertConfigElement({ el: label, leftside: options.leftside })

    label.append(input)
    label.append(document.createTextNode(options.label))

    input.classList.add(options.className)
    input.type = 'number'
    if (options.min) input.min = `${options.min}`
    if (options.max) input.max = `${options.max}`
    input.addEventListener('change', () => options.onChange(parseInt(input.value)))

    return input
  }

  /**
   * @param {object} options
   * @param {string} options.label
   * @param {string} options.className
   * @param {boolean} [options.leftside]
   * @param {() => void} options.onClick
   * @returns {HTMLButtonElement}
   */
  addConfigButton(options) {
    const button = document.createElement('button')
    this.insertConfigElement({ el: button, leftside: options.leftside })

    button.classList.add(options.className)
    button.type = 'button'
    button.innerHTML = options.label
    button.addEventListener('click', () => options.onClick())

    return button
  }

  /**
   * @param {object} options
   * @param {string} options.label
   * @param {string[]} options.labels
   * @param {string} options.className
   * @param {boolean} [options.leftside]
   * @param {(value:string) => void} options.onChange
   * @returns {HTMLSelectElement}
   */
  addConfigSelect(options) {
    const label = document.createElement('label')
    const select = document.createElement('select')
    this.insertConfigElement({ el: label, leftside: options.leftside })

    label.append(select)
    label.append(document.createTextNode(options.label))

    select.classList.add(options.className)
    select.innerHTML = options.labels
      .map((label) => `<option value="${label}">${label}</option>`)
      .join('')
    select.addEventListener('change', () => options.onChange(select.value))

    return select
  }

  /**
   * @private
   * @param {object} options
   * @param {HTMLElement} options.el
   * @param {boolean} [options.leftside]
   * @returns {HTMLElement}
   */
  insertConfigElement(options) {
    const { el, leftside } = options
    const panel = this.configEl.querySelector(leftside ? '.q-config-left' : '.q-config-right')
    leftside ? panel?.append(el) : panel?.prepend(el)
    // @ts-ignore
    return panel
  }

  //////////////////////////////////////////////////////////////////////////////
  /**
   * @private
   * @returns {HTMLInputElement}
   */
  requiredConfigCheckbox

  /** @returns {boolean} */
  get required() {
    return !!this.requiredConfigCheckbox?.checked
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    if (!this.requiredConfigCheckbox) {
      this.requiredConfigCheckbox = this.addConfigCheckbox({
        label: 'Required',
        className: 'q-required',
        onChange: this.onRequiredChange.bind(this),
      })
    }

    this.requiredConfigCheckbox.checked = required
    if (this.preview) {
      this.onRequiredChange(required)
    }
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    throw new Error('Not Implemented!')
  }

  //////////////////////////////////////////////////////////////////////////////

  /**
   * @private
   * @returns {HTMLInputElement}
   */
  shuffleConfigCheckbox

  /** @returns {boolean} */
  get isShuffleMode() {
    return !!this.shuffleConfigCheckbox?.checked
  }

  /**
   * @param {boolean} shuffled
   */
  set isShuffleMode(shuffled) {
    if (!this.shuffleConfigCheckbox) {
      this.shuffleConfigCheckbox = this.addConfigCheckbox({
        label: 'Shuffle',
        className: 'q-shuffle',
        onChange: (checked) => (this.isShuffleMode = checked),
      })
    }

    this.shuffleConfigCheckbox.checked = shuffled

    if (this.preview) {
      this.onShuffleChange(shuffled)
    }
  }

  /**
   * @param {boolean} shuffled
   */
  onShuffleChange(shuffled) {
    throw new Error('Not Implemented!')
  }

  //////////////////////////////////////////////////////////////////////////////
  toJSON() {
    return {
      className: this.constructor.name,
      name: this.name,
      required: this.required,
      isShuffleMode: this.isShuffleMode,
      title: this.title,
    }
  }

  /**
   * @param {any} json
   * @param {boolean} preview
   */
  static fromJSON(json, preview = true) {
    return new Question(json.title, json.name, preview)
  }
}
