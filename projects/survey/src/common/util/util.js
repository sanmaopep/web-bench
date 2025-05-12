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
 * @param {Element} el
 * @see https://stackoverflow.com/a/28222246/1835843
 */
export function getOffset(el) {
  const rect = el.getBoundingClientRect()
  const left = rect.left + window.scrollX
  const top = rect.top + window.scrollY
  const width = rect.width
  const height = rect.height

  return {
    left,
    top,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2,
    right: left + width,
    bottom: top + height,
  }
}

/**
 * @param {any[]} array
 * @returns {any[]}
 */
export function shuffle(array) {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle
  while (currentIndex > 0) {
    // Pick a remaining element randomly
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // Swap it with the current element
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
