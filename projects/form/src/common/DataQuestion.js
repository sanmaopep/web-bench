import { Question } from './Question.js'

export class DataQuestion extends Question {
  /** @type {HTMLInputElement} */
  inputControl

  /**
   * @param {string} title
   * @param {string} name
   * @param {'url'|'tel'|'email'|'date'|'number'} type
   */
  constructor(title, name, type) {
    super(title, name)

    let inputControl
    inputControl = document.createElement('input')
    inputControl.type = type
    this.inputControl = inputControl

    inputControl.name = name
    inputControl.placeholder = `Enter your ${type} here...`
    this.contentElements = [inputControl]

    // Config
    this.required = false
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
    return { ...data, type: this.inputControl.type }
  }
}
