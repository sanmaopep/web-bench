import { Question } from './Question.js'
import { Draggable } from './util/Draggable.js'
import { shuffle } from './util/util.js'

export class RankingQuestion extends Question {
  /** @type {HTMLElement} */
  container

  /**
   * @param {string} title
   * @param {string} name
   * @param {boolean} preview
   * @param {string[]} options
   */
  constructor(title, name, preview, options) {
    super(title, name, preview)

    const container = document.createElement('div')
    this.container = container
    container.className = 'ranking'
    const hidden = document.createElement('input')
    hidden.type = 'hidden'
    hidden.name = name
    this.contentEls = [hidden, container]

    this.setOptions(options)

    // Config
    this.isShuffleMode = false
    this.addOptionButton = this.addConfigButton({
      label: '+ Option',
      className: 'add-option',
      leftside: true,
      onClick: () => {
        this.setOptions([...this.options, 'New Option'])
      },
    })
  }

  /** @type {string[]} */
  get options() {
    const optionEls = [...this.bodyEl.querySelectorAll('.option')]
    if (this.isShuffleMode) {
      optionEls.sort((a, b) => {
        const aValue = a.getAttribute('data-index') ?? ''
        const bValue = b.getAttribute('data-index') ?? ''
        return aValue.localeCompare(bValue)
      })
    }

    // @ts-ignore
    return optionEls.map((el) => el.innerText ?? '')
  }

  /**
   * @param {string[]} options
   */
  setOptions(options) {
    const { preview, name, container } = this

    container.innerHTML = ''
    for (let i = 0; i < options.length; i++) {
      const optionEl = document.createElement('div')
      optionEl.id = `${name}_${i}`
      optionEl.className = 'option'
      optionEl.setAttribute('data-index', `${i}`)
      container.appendChild(optionEl)

      const label = document.createElement('label')
      optionEl.appendChild(label)
      label.className = 'option-text'
      label.innerHTML = options[i]

      if (preview) {
        new Draggable(optionEl, {
          container,
          onDrop: this.updateValue.bind(this),
        })
      } else {
        this.setEditable(label)

        const remove = document.createElement('button')
        optionEl.append(remove)
        remove.className = 'remove-option'
        remove.innerHTML = '-'
        remove.addEventListener('click', () => {
          const opts = this.options
          opts.splice(i, 1)
          this.setOptions(opts)
        })
      }
    }

    this.updateValue()
  }

  /** @returns {HTMLInputElement} */
  get hiddenInput() {
    // @ts-ignore
    return this.root.querySelector(`input[type="hidden"][name="${this.name}"]`)
  }

  updateValue() {
    const options = this.root.querySelectorAll(`.option`)

    this.hiddenInput.value = [...options]
      .map((option) => option.getAttribute('data-index'))
      .join(',')
  }

  /**
   * @param {boolean} shuffleMode
   */
  onShuffleChange(shuffleMode) {
    const container = this.container
    const options = [...container.querySelectorAll('.option')]

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

  static fromJSON(json, preview = true) {
    const question = new RankingQuestion(json.title, json.name, preview, json.options)
    question.isShuffleMode = json.isShuffleMode

    return question
  }
}
