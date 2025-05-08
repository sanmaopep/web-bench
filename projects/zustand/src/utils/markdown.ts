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