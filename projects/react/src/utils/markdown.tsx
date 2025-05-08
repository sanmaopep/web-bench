import React from 'react'

export const renderMarkdown = (text: string) => {
  const lines = text.split('\n')
  return lines.map((line, index) => {
    if (line.startsWith('# ')) {
      return <h1 key={index}>{line.slice(2)}</h1>
    } else if (line.startsWith('## ')) {
      return <h2 key={index}>{line.slice(3)}</h2>
    } else if (line.startsWith('### ')) {
      return <h3 key={index}>{line.slice(4)}</h3>
    } else if (line.startsWith('- ')) {
      return <li key={index}>{line.slice(2)}</li>
    } else if (line.match(/\*\*.+\*\*/)) {
      return <p key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
    } else if (line.match(/\*.+\*/)) {
      return <p key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
    } else {
      return <p key={index}>{line}</p>
    }
  })
}

export const sanitizeHTML = (html: string) => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}