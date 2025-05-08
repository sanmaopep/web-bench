import { Question } from './Question.js'

export class DataQuestion extends Question {
  /** @type {HTMLInputElement} */
  inputControl

  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   * @param {'url'|'tel'|'email'|'date'|'number'} type
   */
  constructor(title, name, preview, type) {
    super(title, name, preview)

    const inputControl = document.createElement('input')
    this.inputControl = inputControl
    inputControl.name = name
    this.contentEls = [inputControl]

    // Config
    this.required = false
    this.type = type
  }

  //////////////////////////////////////////////////////////////////////////////
  /** @type {HTMLSelectElement} */
  typeConfigSelect

  get type() {
    return this.typeConfigSelect.value
  }

  /**
   * @param {string} type
   */
  set type(type) {
    if (!this.typeConfigSelect) {
      this.typeConfigSelect = this.addConfigSelect({
        label: 'Type',
        labels: ['url', 'tel', 'email', 'date', 'number'],
        className: 'q-type',
        leftside: true,
        onChange: this.onTypeChange.bind(this),
      })
    }

    this.typeConfigSelect.value = `${type}`
    this.onTypeChange(type)
  }

  /**
   * @param {string} type
   */
  onTypeChange(type) {
    this.inputControl.type = type
    this.inputControl.placeholder = `Enter your ${type} here...`
  }

  //////////////////////////////////////////////////////////////////////////////
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

  static fromJSON(json, preview = true) {
    const question = new DataQuestion(json.title, json.name, preview, json.type)
    question.required = json.required

    return question
  }
}
