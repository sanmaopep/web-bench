import { Question } from './Question.js'
import { Draggable } from './util/Draggable.js'
import { shuffle } from './util/util.js'

export class RankingQuestion extends Question {
  /** @type {HTMLElement} */
  container
  options

  /**
   * @param {string} title
   * @param {string} name
   * @param {string[]} options
   */
  constructor(title, name, options) {
    super(title, name)
    this.options = options

    const container = document.createElement('div')
    this.container = container
    container.className = 'ranking-container'

    // Create hidden input to store the value
    const hidden = document.createElement('input')
    hidden.type = 'hidden'
    hidden.name = name

    for (let i = 0; i < options.length; i++) {
      const item = document.createElement('div')
      item.id = `${name}_${i}`
      item.className = 'ranking-item'
      item.innerHTML = options[i]
      item.setAttribute('data-index', `${i}`)
      container.appendChild(item)
      this.contentElements = [hidden, container]

      new Draggable(item, {
        container,
        onDrop: this.updateValue.bind(this),
      })
    }

    this.updateValue()

    // Config
    // this.required = false
    this.isShuffleMode = false
  }

  /** @returns {HTMLInputElement} */
  get hiddenInput() {
    // @ts-ignore
    return this.root.querySelector(`input[type="hidden"][name="${this.name}"]`)
  }

  updateValue() {
    const options = this.root.querySelectorAll(`.ranking-item`)

    this.hiddenInput.value = [...options]
      .map((option) => option.getAttribute('data-index'))
      .join(',')
  }

  /**
   * @param {boolean} shuffleMode
   */
  onShuffleChange(shuffleMode) {
    const container = this.container
    const options = [...container.querySelectorAll('.ranking-item')]

    if (shuffleMode) {
      shuffle(options).forEach((option) => container.appendChild(option))
    } else {
      options
        .sort(
          (a, b) =>
            a.getAttribute('data-index')?.localeCompare(b.getAttribute('data-index') ?? '') ?? 0
        )
        .forEach((option) => container.appendChild(option))
    }
  }

  toJSON() {
    const data = super.toJSON()
    return { ...data, options: this.options }
  }
}
