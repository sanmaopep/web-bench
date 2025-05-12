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

/** @type {Element | null} */
let selectedEntry = null

// task-3
/** @param {Element | null} ent */
export function setSelectedEntry(ent) {
  /** @type {HTMLButtonElement | null} */
  const delButton = document?.querySelector('.tools button:nth-child(3)')

  const oldSelectedEntry = selectedEntry
  selectedEntry = ent

  // Effects
  oldSelectedEntry?.classList.remove('selected')
  selectedEntry?.classList.add('selected')
  if (selectedEntry?.classList.contains('dir')) {
    selectedEntry?.classList.toggle('open')
  }

  if (delButton) delButton.disabled = !selectedEntry
}

export function getSelectedEntry() {
  return selectedEntry
}
