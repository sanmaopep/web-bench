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

/**
 * @param {string} id
 * @param {any} value
 */
export function log(id, value) {
  const item = document.createElement('li')
  item.id = id
  item.className = 'item'
  item.innerHTML = `${value}`
  document.querySelector('.log')?.append(item)
}

export async function getLangs() {
  return (await import('./lang.js')).langs
}
