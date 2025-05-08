import { Question } from './Question.js'
import { shuffle } from './util/util.js'

export class SingleSelectionQuestion extends Question {
  /** @type {string[]} */
  options

  /**
   * @param {string} title
   * @param {string} name
   * @param {string[]} options
   */
  constructor(title, name, options) {
    super(title, name)
    this.options = options

    // Config
    this.required = false
    this.isSelectMode = false
    this.isShuffleMode = false
  }

  /** @type {HTMLInputElement | null} */
  selectConfigCheckbox

  /** @returns {boolean} */
  get isSelectMode() {
    return !!this.selectConfigCheckbox?.checked
  }

  /**
   * @param {boolean} selectMode
   */
  set isSelectMode(selectMode) {
    if (!this.selectConfigCheckbox) {
      this.selectConfigCheckbox = this.addConfigCheckbox({
        label: 'Select',
        className: 'q-select',
        onChange: (checked) => (this.isSelectMode = checked),
      })
    }

    this.selectConfigCheckbox.checked = selectMode

    const required = this.required
    if (!selectMode) {
      this.contentElements = this.options.map((option, index) => {
        const label = document.createElement('label')
        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = this.name
        radio.value = `${index}`
        if (required) radio.required = true

        label.appendChild(radio)
        label.appendChild(document.createTextNode(option))
        label.appendChild(document.createElement('br'))

        return label
      })
    } else {
      const select = document.createElement('select')
      select.name = this.name
      if (required) select.required = true
      this.options.forEach((option, index) => {
        const optionElement = document.createElement('option')
        select.appendChild(optionElement)

        optionElement.innerHTML = option
        optionElement.value = `${index}`
      })

      select.options.selectedIndex = -1
      this.contentElements = [select]
    }
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    if (this.isSelectMode) {
      const select = this.bodyElement.querySelector('select')
      required ? select?.setAttribute('required', 'true') : select?.removeAttribute('required')
    } else {
      this.bodyElement.querySelectorAll('input[type="radio"]').forEach((radio) => {
        required ? radio.setAttribute('required', 'true') : radio.removeAttribute('required')
      })
    }
  }

  /**
   * @param {boolean} shuffleMode
   */
  onShuffleChange(shuffleMode) {
    if (this.isSelectMode) {
      const container = this.bodyElement.querySelector('select')
      const options = [...this.bodyElement.querySelectorAll('select option')]
      if (!container) return

      if (shuffleMode) {
        shuffle(options).forEach((option) => container.appendChild(option))
      } else {
        options
          // @ts-ignore
          .sort((a, b) => a.value.localeCompare(b.value ?? '') ?? 0)
          .forEach((option) => container.appendChild(option))
      }
    } else {
      const container = this.bodyElement
      const options = [...this.bodyElement.querySelectorAll('label')]

      if (shuffleMode) {
        shuffle(options).forEach((option) => container.appendChild(option))
      } else {
        options
          .sort((a, b) => {
            // @ts-ignore
            const aValue = a.querySelector('input[type="radio"]')?.value ?? ''
            // @ts-ignore
            const bValue = b.querySelector('input[type="radio"]')?.value ?? ''
            return aValue.localeCompare(bValue)
          })
          .forEach((option) => container.appendChild(option))
      }
    }
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, options: this.options, isSelectMode: this.isSelectMode }
  }
}
