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

document.addEventListener('DOMContentLoaded', () => {
  const isInsideFrame = window.self !== window.top
  // exclude opened directly from browser address bar
  const isOpenedByParent = window.opener && window.self !== window.opener

  if (isInsideFrame) {
    runInIframe()
  }

  if (!isInsideFrame && isOpenedByParent) {
    runOutIframe()
  }

  document.addEventListener('click', () => {
    if (window.top) {
      // console.log('[doc] top:', window.top?.document.title)
      window.top.document.querySelectorAll('.menu').forEach((el) => el.remove())
    }
  })

  {
    const keyword = document.createElement('input')
    keyword.className = 'keyword'
    Object.assign(keyword.style, { position: 'fixed', right: '8px', bottom: '8px' })
    keyword.placeholder = 'Search by Keywords'
    keyword.addEventListener('keyup', () => {
      search(keyword.value)
    })
    document.body.append(keyword)
  }
})

/**
 * @param {string} keyword
 */
function search(keyword) {
  keyword = keyword.toLowerCase()
  removeHighlights()
  mergeTextNodes(document.body)
  const textNodes = getTextNodes(document.body)
  console.log(textNodes)
  if(!keyword) return

  textNodes.forEach((textNode) => {
    const text = textNode.textContent?.toLowerCase()
    if (!text) return

    let startIndex = text.indexOf(keyword)
    const ranges = []
    while (startIndex !== -1) {
      const endIndex = startIndex + keyword.length
      // console.log({ startIndex, endIndex })
      const range = document.createRange()
      range.setStart(textNode, startIndex)
      range.setEnd(textNode, endIndex)
      ranges.push(range)

      startIndex = text.indexOf(keyword, endIndex) ?? -1
    }

    ranges.forEach((range) => {
      const mark = document.createElement('span')
      mark.className = 'highlight'
      range.surroundContents(mark)
    })
  })
}

function removeHighlights() {
  document
    .querySelectorAll('span.highlight')
    .forEach((el) => el.replaceWith(document.createTextNode(el.textContent ?? '')))
}

/**
 * @param {Node} node
 */
function mergeTextNodes(node) {
  for (let i = 0; i < node.childNodes.length; i++) {
    const textNodes = []
    while (node.childNodes[i]?.nodeType === Node.TEXT_NODE) {
      textNodes.push(node.childNodes[i])
      i++
    }

    if (textNodes.length > 1) {
      const text = textNodes.map((node) => node.textContent).join('')
      textNodes[0].textContent = text
      textNodes.slice(1).forEach((node) => node.remove())
    }

    if (node.childNodes[i]) mergeTextNodes(node.childNodes[i])
  }
}

/**
 * @param {Node} node
 * @returns {Node[]}
 */
function getTextNodes(node) {
  let textNodes = []
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      textNodes.push(child)
    }

    textNodes.push(...getTextNodes(child))
  })
  return textNodes
}

// {
//   const textElement = document.querySelector('h1')
//   const range = document.createRange()
//   const selection = window.getSelection()
//   if (!selection || !textElement) return

//   range.selectNodeContents(textElement)
//   selection.removeAllRanges()
//   selection.addRange(range)

//   console.log('Text selected:', selection.toString())
// }

function runOutIframe() {
  // closeButton
  const closeButton = document.createElement('button')
  closeButton.className = 'close'
  Object.assign(closeButton.style, { position: 'fixed', right: '8px', top: '8px' })
  closeButton.innerHTML = '✕'
  closeButton.addEventListener('click', () => {
    window.close()
  })
  document.body.append(closeButton)

  function changeTheme(theme) {
    console.log('[doc.changeTheme]', theme)
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
  }
  // initial theme
  const theme = window.opener.top.document.querySelector('.theme').value
  console.log('[doc]', { top: window.opener.top.document.title, theme })
  changeTheme(theme)

  // theme by postMessage
  window.addEventListener('message', (ev) => {
    console.log(ev)
    if (ev.data.theme) {
      changeTheme(ev.data.theme)
    }
  })
}

function runInIframe() {
  // openButton
  const openButton = document.createElement('button')
  openButton.className = 'open'
  Object.assign(openButton.style, { position: 'fixed', right: '8px', top: '8px' })
  openButton.innerHTML = '⎋'
  openButton.addEventListener('click', () => {
    const newWindow = window.open(location.href)
    // @ts-ignore
    if (!('newWindows' in window)) window.newWindows = []
    // @ts-ignore
    window.newWindows.push(newWindow)
  })
  document.body.append(openButton)
}
