import { Model } from '@web-bench/bench-agent'

const _keys = [
  'ANTHROPIC_API_KEY',
  'OPENROUTER_API_KEY',
  'OPENAI_API_KEY',
  'MOONSHOT_API_KEY',
  'DEEPSEEK_API_KEY',
  'DOUBAO_API_KEY',
  'DOUBAO_ENDPOINT',
]
const _keyRegExps: { [k: string]: RegExp } = {}
_keys.forEach((key) => {
  _keyRegExps[key] = new RegExp(`\{\{${key}\}\}`, 'ig')
})

/**
 * @deprecated use loadEnvForModels instead
 * @param models
 * @returns
 */
export function loadAPIKeyFor(models: Model[]) {
  models.forEach((model) => {
    Object.entries(_keyRegExps).forEach(([key, keyRegExp]) => {
      if (process.env[key]) {
        model.apiKey = model.apiKey.replace(keyRegExp, process.env[key])
      }
    })
  })

  // console.log(models);
  return models
}
