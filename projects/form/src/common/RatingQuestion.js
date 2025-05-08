import { Question } from './Question.js'

export class RatingQuestion extends Question {
  starCount

  /**
   * @param {string} title
   * @param {string} name
   * @param {number} starCount
   */
  constructor(title, name, starCount = 5) {
    super(title, name)
    this.starCount = starCount

    if (starCount <= 0) starCount = 1

    const container = document.createElement('div')
    container.className = 'rating-container'

    for (let i = 1; i <= starCount; i++) {
      const starLabel = document.createElement('label')
      container.appendChild(starLabel)
      const starRadio = document.createElement('input')
      starLabel.appendChild(starRadio)
      starLabel.appendChild(document.createTextNode('★'))

      starLabel.className = 'star'
      starLabel.addEventListener('click', () => {
        container.querySelectorAll('.star').forEach((s, index) => {
          s.classList.toggle('active', index < i)
        })
      })
      starRadio.type = 'radio'
      starRadio.name = name
      starRadio.value = `${i / starCount}`
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

  toJSON() {
    const data = super.toJSON()
    return { ...data, starCount: this.starCount }
  }
}
