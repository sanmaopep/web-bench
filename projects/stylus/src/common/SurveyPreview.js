// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
