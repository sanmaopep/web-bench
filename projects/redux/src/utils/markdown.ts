/**
 * Simple Markdown parser that converts Markdown to HTML
 * This is a basic implementation and doesn't cover all Markdown features
 * It also implements security measures to prevent XSS attacks
 */

// Sanitize HTML to prevent XSS attacks
const sanitizeHTML = (html: string): string => {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

export const parseMarkdown = (markdown: string): string => {
  if (!markdown) return '';

  let html = markdown;

  // Sanitize input
  html = sanitizeHTML(html);

  // Handle code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Handle headers
  html = html.replace(/^(#+)\s+(.*)$/gm, (match, hashes, content) => {
    const level = Math.min(hashes.length, 6);
    return `<h${level}>${content}</h${level}>`;
  });

  // Handle bold and italic
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([\s\S]*?)\*/g, '<em>$1</em>');

  // Handle lists
  html = html.replace(/^\s*-\s+/gm, '<li>').replace(/(<li>[^<]+)/g, '$1</li>').replace(/<li><\/li>/g, '').replace(/<li>([\s\S]*?)<\/li>/g, '<ul>$1</ul>');

  // Handle paragraphs
  html = html.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('');

  return html;
};