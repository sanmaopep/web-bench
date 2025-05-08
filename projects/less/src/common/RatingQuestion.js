import { Question } from './Question.js'

export class RatingQuestion extends Question {
  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   * @param {number} starCount
   */
  constructor(title, name, preview, starCount = 5) {
    super(title, name, preview)

    if (starCount <= 0) starCount = 1

    // Config
    this.required = false
    this.starCount = starCount
  }

  /**
   * @param {number} starCount
   */
  setOptions(starCount) {
    const container = document.createElement('div')
    container.className = 'rating'

    for (let i = 1; i <= starCount; i++) {
      const optionEl = document.createElement('label')
      container.appendChild(optionEl)
      const radio = document.createElement('input')
      optionEl.appendChild(radio)
      optionEl.appendChild(document.createTextNode('★'))

      optionEl.className = 'option'
      if (this.preview) {
        optionEl.addEventListener('click', () => {
          container.querySelectorAll('.option').forEach((s, index) => {
            s.classList.toggle('active', index < i)
          })
        })
      }
      radio.disabled = !this.preview
      radio.type = 'radio'
      radio.name = this.name
      radio.value = `${i / starCount}`
    }

    this.contentEls = [container]
  }

  //////////////////////////////////////////////////////////////////////////////
  /** @returns {HTMLInputElement} */
  starCountConfigInput

  get starCount() {
    return parseInt(this.starCountConfigInput?.value ?? '0')
  }

  set starCount(starCount) {
    if (!this.starCountConfigInput) {
      this.starCountConfigInput = this.addConfigNumberInput({
        label: 'starCount',
        className: 'q-starCount',
        leftside: true,
        onChange: this.onStarCountChange.bind(this),
        min: 1,
      })
    }

    this.starCountConfigInput.value = starCount
    this.onStarCountChange?.(starCount)
  }

  /**
   * @param {number} starCount
   */
  onStarCountChange(starCount) {
    this.setOptions(starCount)
  }

  //////////////////////////////////////////////////////////////////////////////
  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.bodyEl.querySelectorAll('input[type="radio"]').forEach((radio) => {
      required ? radio.setAttribute('required', 'true') : radio.removeAttribute('required')
    })
  }

  //////////////////////////////////////////////////////////////////////////////
  toJSON() {
    const data = super.toJSON()
    return { ...data, starCount: this.starCount }
  }

  static fromJSON(json, preview = true) {
    const question = new RatingQuestion(json.title, json.name, preview, json.starCount)
    question.required = json.required

    return question
  }
}
