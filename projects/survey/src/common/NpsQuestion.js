import { Question } from './Question.js'

export class NpsQuestion extends Question {
  /** @type {HTMLElement} */
  container

  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   */
  constructor(title, name, preview) {
    super(title, name, preview)

    const container = document.createElement('div')
    this.container = container
    container.className = 'nps'

    this.setOptions()

    // Config
    this.required = false
  }

  setOptions() {
    const { container, name, preview } = this

    for (let i = 0; i <= 10; i++) {
      const option = document.createElement('label')
      container.appendChild(option)
      const score = document.createElement('input')
      option.append(score)
      option.append(document.createTextNode(`${i}`))

      option.className = 'option'
      if (preview) {
        option.addEventListener('click', () => {
          container.querySelectorAll('.option.active').forEach((s, index) => {
            s.classList.remove('active')
          })
          option.classList.add('active')
        })
      }

      score.type = 'radio'
      score.name = name
      score.value = `${i}`
    }

    this.contentEls = [container]
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.bodyEl.querySelectorAll('input[type="radio"]').forEach((radio) => {
      required ? radio.setAttribute('required', 'true') : radio.removeAttribute('required')
    })
  }

  static fromJSON(json, preview = true) {
    const question = new NpsQuestion(json.title, json.name, preview)
    question.required = json.required

    return question
  }
}
