import { Question } from './Question.js'

export class OpenQuestion extends Question {
  /** @type {HTMLInputElement | HTMLTextAreaElement} */
  inputControl
  isMultilines

  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} isMultilines
   */
  constructor(title, name, isMultilines) {
    super(title, name)
    this.isMultilines = isMultilines

    let inputControl
    if (!isMultilines) {
      inputControl = document.createElement('input')
      inputControl.type = 'text'
    } else {
      inputControl = document.createElement('textarea')
      inputControl.rows = 4
      inputControl.cols = 50
    }
    inputControl.minLength = 0
    this.inputControl = inputControl

    inputControl.name = name
    inputControl.placeholder = 'Enter your answer here...'
    this.contentElements = [inputControl]

    // Config
    this.required = false
  }

  get minLength() {
    return this.inputControl.minLength
  }

  /**
   * @param {number} length
   */
  set minLength(length) {
    this.inputControl.minLength = length
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    required
      ? this.inputControl.setAttribute('required', 'true')
      : this.inputControl.removeAttribute('required')
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, isMultilines: this.isMultilines, minLength: this.minLength }
  }
}
