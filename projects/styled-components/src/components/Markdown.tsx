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

import styled from 'styled-components'
import { useMemo } from 'react'

const MarkdownContainer = styled.div`
  h1 {
    color: ${(props) => props.theme.markdownH1};
    font-size: 2em;
    margin-bottom: 0.5em;
  }

  h2 {
    color: ${(props) => props.theme.markdownH2};
    font-size: 1.5em;
    margin-bottom: 0.5em;
  }

  h3 {
    color: ${(props) => props.theme.markdownH3};
    font-size: 1.25em;
    margin-bottom: 0.5em;
  }

  h4 {
    color: ${(props) => props.theme.markdownH4};
    font-size: 1.1em;
    margin-bottom: 0.5em;
  }

  p {
    margin-bottom: 1em;
    line-height: 1.6;
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  ul,
  ol {
    margin-left: 2em;
    margin-bottom: 1em;
  }

  code {
    background: #f4f4f4;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }
`

const parseMarkdown = (markdown: string): string => {
  // Headers
  let html = markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Lists
  html = html.replace(/^\- (.+)/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')

  // Code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>')

  // Paragraphs
  html = html
    .split('\n\n')
    .map((paragraph) => {
      if (
        !paragraph.startsWith('<h1>') &&
        !paragraph.startsWith('<h2>') &&
        !paragraph.startsWith('<h3>') &&
        !paragraph.startsWith('<h4>') &&
        !paragraph.startsWith('<ul>')
      ) {
        return `<p>${paragraph}</p>`
      }
      return paragraph
    })
    .join('')

  return html
}

interface MarkdownProps {
  content: string
  className?: string
}

export const Markdown = ({ content, className }: MarkdownProps) => {
  const parsedContent = useMemo(() => parseMarkdown(content), [content])

  return (
    <MarkdownContainer className={className} dangerouslySetInnerHTML={{ __html: parsedContent }} />
  )
}
