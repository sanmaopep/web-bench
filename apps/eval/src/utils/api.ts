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
