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

import * as entry from './entry.js'

/**
 * @param {string} keyword
 * @param {Element} ent
 * @returns {boolean}
 */
function matchEntry(keyword, ent) {
  const name = entry.getName(ent).toLowerCase() ?? ''
  return name.includes(keyword.toLowerCase())
}

let lastKeyword = ''

/**
 * @param {string} keyword
 */
export function filterEntries(keyword) {
  if (!keyword.trim()) {
    // Show all entries if keyword is empty
    document.querySelectorAll('.entry').forEach((ent) => {
      if (!(ent instanceof HTMLElement)) return
      ent.style.display = ''
    })
    return
  }

  document.querySelectorAll('.entry').forEach((ent) => {
    if (!(ent instanceof HTMLElement)) return
    if (matchEntry(keyword, ent)) {
      ent.style.display = ''
      // If it's a matching file/dir, make sure its parent dirs are visible
      let parent = ent.parentElement

      while (parent && !parent?.classList.contains('entries')) {
        if (parent.classList.contains('dir')) {
          if (!parent.classList.contains('open')) parent.classList.add('open')
          parent.style.display = ''
        }
        parent = parent.parentElement
      }
    } else {
      ent.style.display = 'none'
    }
  })
}

export function showFilterDialog() {
  const keyword = prompt('Enter filter keyword:', lastKeyword)
  if (keyword !== null) {
    lastKeyword = keyword
    filterEntries(keyword)
  }
}
