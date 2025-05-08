import { SurveyForm } from './SurveyForm.js'

export class SurveyPreview extends SurveyForm {
  /**
   * @param {string} formSelector
   * @param {{title:string, questions: any[]}} data
   */
  constructor(formSelector, data) {
    super(formSelector, data)

    const button = document.createElement('button')
    this.toolbarEl.appendChild(button)
    button.type = 'submit'
    button.className = 'submit'
    button.innerHTML = 'Submit'

    this.render()
  }

  render() {
    const data = this.data
    console.log(data)

    this.titleEl.innerHTML = data.title ?? ''
    data.questions?.forEach((json) => {
      const cls = this.questionClassCache[json.className]
      if (cls) {
        this.appendQuestion(cls.fromJSON(json))
      }
    })
  }
}
