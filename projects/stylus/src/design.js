import { SurveyDesign } from './common/SurveyDesign.js'

document.addEventListener('DOMContentLoaded', () => {
  const dataKey = new URL(location.href).searchParams.get('key') ?? 'data'
  const data = JSON.parse(localStorage[dataKey] ?? '{"title":"Sample Survey", "questions":[]}')
  new SurveyDesign('form', data)
})
