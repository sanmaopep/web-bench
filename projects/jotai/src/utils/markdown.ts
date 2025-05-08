export const renderMarkdown = (text: string): string => {
  if (!text) return '';
  
  // Sanitize to prevent XSS
  const sanitized = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Process Markdown
  return sanitized
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks with language
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
      return `<pre class="code-block${language ? ` language-${language}` : ''}"><code>${code.trim()}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Images
    .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Lists - Unordered
    .replace(/^\s*[-+*]\s+(.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)\s+(?=<li>)/g, '$1')
    .replace(/(?:^<li>)([\s\S]*?)(?:<\/li>$)/gm, '<ul>$&</ul>')
    // Lists - Ordered
    .replace(/^\s*(\d+)\.\s+(.*)/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>)\s+(?=<li>)/g, '$1')
    .replace(/(?:^<li>)([\s\S]*?)(?:<\/li>$)/gm, '<ol>$&</ol>')
    // Blockquotes
    .replace(/^\s*>\s+(.*)/gm, '<blockquote>$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Line breaks and paragraphs
    .replace(/\n\s*\n/g, '</p><p>')
    .replace(/^(.+)(?:\n|$)/gm, (match) => {
      if (
        match.startsWith('<h') ||
        match.startsWith('<ul') ||
        match.startsWith('<ol') ||
        match.startsWith('<blockquote') ||
        match.startsWith('<hr') ||
        match.startsWith('<p')
      ) {
        return match;
      }
      return `<p>${match}</p>`;
    })
    // Clean up any nested paragraphs
    .replace(/<p><p>/g, '<p>')
    .replace(/<\/p><\/p>/g, '</p>');
};