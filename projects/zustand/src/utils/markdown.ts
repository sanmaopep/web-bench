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

export function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\n/g, '<br/>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
}

export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const whitelist = ['H1', 'H2', 'H3', 'STRONG', 'EM', 'BR', 'A', 'P', 'UL', 'OL', 'LI']
  const elements = doc.body.getElementsByTagName('*')

  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i]
    if (!whitelist.includes(el.tagName)) {
      el.parentNode?.removeChild(el)
    } else if (el.tagName === 'A') {
      const href = el.getAttribute('href')
      if (href?.startsWith('javascript:')) {
        el.removeAttribute('href')
      }
    }
  }

  return doc.body.innerHTML
}