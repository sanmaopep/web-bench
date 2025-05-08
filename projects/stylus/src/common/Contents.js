import { getOffset } from './util/util.js'
import { Draggable } from './util/Draggable.js'
import { SurveyForm } from './SurveyForm.js'

export class Contents {
  /** @type {HTMLElement} */
  root
  /** @type {SurveyForm} */
  surveyForm

  /**
   * @param {SurveyForm} surveyForm
   */
  constructor(surveyForm) {
    this.surveyForm = surveyForm

    const contents = document.createElement('ul')
    contents.className = 'contents'

    this.root = contents
    document.body.appendChild(contents)
  }

  update() {
    this.root.innerHTML = ''
    this.surveyForm.questions.forEach((question, i) => {
      const item = document.createElement('li')
      item.className = 'contents-item'
      item.id = `${item.className}_${i}`
      item.innerHTML = `${question.querySelector('.q-title')?.innerHTML ?? ''}`
      item.setAttribute('q-id', question.id)
      item.addEventListener('click', () => {
        const qeustionOffset = getOffset(question)
        // console.log({ qeustionOffset, question, item })
        document.documentElement.scrollTo(0, qeustionOffset.top)
      })
      this.root.appendChild(item)

      new Draggable(item, {
        container: this.root,
        onDrop: (side, sourceItem, targetItem) => {
          // console.log({ sourceItem, targetItem })
          const sourceQuestion = document.getElementById(sourceItem.getAttribute('q-id') ?? '')
          const targetQuestion = document.getElementById(targetItem.getAttribute('q-id') ?? '')
          if (side === 'bottom') {
            if (sourceQuestion) targetQuestion?.after(sourceQuestion)
          } else if (side === 'top') {
            if (sourceQuestion) targetQuestion?.before(sourceQuestion)
          }
          this.surveyForm.update()
        },
      })
    })
  }
}
