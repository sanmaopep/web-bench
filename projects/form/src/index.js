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

import { DataQuestion } from './common/DataQuestion.js'
import { LikertQuestion } from './common/LikertQuestion.js'
import { MultiSelectionQuestion } from './common/MultiSelectionQuestion.js'
import { NpsQuestion } from './common/NpsQuestion.js'
import { OpenQuestion } from './common/OpenQuestion.js'
import { Question } from './common/Question.js'
import { RankingQuestion } from './common/RankingQuestion.js'
import { RatingQuestion } from './common/RatingQuestion.js'
import { SingleSelectionQuestion } from './common/SingleSelectionQuestion.js'
import { Survey } from './common/Survey.js'

document.addEventListener('DOMContentLoaded', () => {
  const survey = new Survey('form', 'Form Project')
  survey.prependQuestions([
    new Question('sample empty question', 'q'),
    new SingleSelectionQuestion('Single Selection Question 1', 'single1', [
      'Option 1',
      'Option 2',
      'Option 3',
    ]),
    new MultiSelectionQuestion('Multi Selection Question 1', 'multi1', [
      'Option 1',
      'Option 2',
      'Option 3',
    ]),
    new OpenQuestion('Open Question 1', 'open1', false),
    new OpenQuestion('Open Question 2', 'open2', true),
    new RatingQuestion('Rate your experience', 'rating1'),
    new RatingQuestion('Rate your satisfaction', 'rating2', 10),
    new RankingQuestion('Ranking your favs', 'ranking1', ['Coffee', 'Tea', 'Milk']),
    new NpsQuestion('How are you satisfied with our product?', 'nps1'),
    new LikertQuestion(
      'How are you satisfied with our service?',
      'likert1',
      ['Greate', 'Good', 'OK', 'Bad', 'Terrible'],
      ['Service 1', 'Service 2', 'Service 3']
    ),
  ])

  survey.appendQuestions(
    ['url', 'tel', 'email', 'date', 'number'].map(
      // @ts-ignore
      (type) => new DataQuestion(`Data Question ${type}`, `data-${type}`, type)
    )
  )

  const submit = document.createElement('button')
  submit.innerHTML = 'Submit'
  submit.type = 'submit'
  survey.form.append(submit)

  document.querySelector('.export')?.addEventListener('click', () => {
    const data = survey.toJSON()
    console.log(data.questions)
    console.log(data)
    localStorage.data = JSON.stringify(data)
  })
})
