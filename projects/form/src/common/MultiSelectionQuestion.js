import { Question } from './Question.js'
import { shuffle } from './util/util.js'

export class MultiSelectionQuestion extends Question {
  options

  /**
   * @param {string} title
   * @param {string} name
   * @param {string[]} options
   */
  constructor(title, name, options) {
    super(title, name)
    this.options = options

    this.contentElements = options.map((option, index) => {
      const label = document.createElement('label')
      const radio = document.createElement('input')
      radio.type = 'checkbox'
      radio.name = name
      radio.value = `${index}`

      label.appendChild(radio)
      label.appendChild(document.createTextNode(option))
      label.appendChild(document.createElement('br'))

      return label
    })

    document.querySelector('form')?.addEventListener('submit', (e) => {
      const count = this.bodyElement.querySelectorAll('input[type="checkbox"]:checked').length
      if (count < this.checkedCount) {
        e.stopPropagation()
        e.preventDefault()
        alert(`${MultiSelectionQuestion.name}, at least 1 option should be checked.`)
      }
    })
    
    // Config
    this.required = false
    this.isShuffleMode = false
  }

  checkedCount = 0

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.checkedCount = required ? 1 : 0
  }

  /**
   * @param {boolean} shuffleMode
   */
  onShuffleChange(shuffleMode) {
    const options = [...this.bodyElement.querySelectorAll('label')]
    if (shuffleMode) {
      shuffle(options).forEach((option) => this.bodyElement.appendChild(option))
    } else {
      options
        .sort(
          (a, b) =>
            a
              .querySelector('input[type="checkbox"]')
              // @ts-ignore
              ?.value.localeCompare(b.querySelector('input[type="checkbox"]')?.value ?? '') ?? 0
        )
        .forEach((option) => this.bodyElement.appendChild(option))
    }
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, options: this.options }
  }
}
