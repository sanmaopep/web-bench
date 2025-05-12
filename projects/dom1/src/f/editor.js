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
 *
 * @param {KeyboardEvent} e
 */
export function handleEdit(e) {
  e.stopPropagation()
  e.preventDefault()
  /** @type {HTMLTextAreaElement} */
  // @ts-ignore
  const editor = e.target
  if (!editor || !editor.hasAttribute('data-file-id')) return

  const fileId = editor.getAttribute('data-file-id') ?? ''
  const file = document.getElementById(fileId)
  if (file) {
    file.setAttribute('data-content', editor.value)
  }

}
