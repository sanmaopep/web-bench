import { SurveyPreview } from './common/SurveyPreview.js'

document.addEventListener('DOMContentLoaded', () => {
  const dataKey = new URL(location.href).searchParams.get('key') ?? 'data'
  const data = JSON.parse(localStorage[dataKey] ?? '{}')
  new SurveyPreview('form', data)
})
