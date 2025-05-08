import { getOffset } from './util/util.js'
import { Draggable } from './util/Draggable.js'
import { Survey } from './Survey.js'

export class Contents {
  /** @type {HTMLElement} */
  root
  /** @type {Survey} */
  survey

  /**
   * @param {Survey} survey
   */
  constructor(survey) {
    this.survey = survey

    const contents = document.createElement('ul')
    contents.className = 'contents'

    this.root = contents
    document.body.appendChild(contents)
  }

  update() {
    ;[...this.root.children].forEach((child) => child.remove())

    this.survey.form.querySelectorAll('.q').forEach((question, i) => {
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
          this.survey.update()
        },
      })
    })
  }
}
