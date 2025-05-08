import { Question } from './Question.js'

export class NpsQuestion extends Question {
  /**
   * @param {string} title
   * @param {string} name
   */
  constructor(title, name) {
    super(title, name)

    const container = document.createElement('div')
    container.className = 'nps-container'

    for (let i = 0; i <= 10; i++) {
      const scoreLabel = document.createElement('label')
      container.appendChild(scoreLabel)
      const score = document.createElement('input')
      scoreLabel.append(score)
      scoreLabel.append(document.createTextNode(`${i}`))

      scoreLabel.className = 'score'
      scoreLabel.addEventListener('click', () => {
        container.querySelectorAll('.score.active').forEach((s, index) => {
          s.classList.remove('active')
        })
        scoreLabel.classList.add('active')
      })

      score.type = 'radio'
      score.name = name
      score.value = `${i}`
    }

    this.contentElements = [container]
    
    // Config
    this.required = false
  }

  /**
   * @param {boolean} required
   */
  onRequiredChange(required) {
    this.bodyElement.querySelectorAll('input[type="radio"]').forEach((radio) => {
      required ? radio.setAttribute('required', 'true') : radio.removeAttribute('required')
    })
  }
}
