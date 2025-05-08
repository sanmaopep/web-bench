export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // Escape HTML to prevent XSS
  const escapedMarkdown = escapeHTML(markdown);
  
  // Process code blocks first (before escaping affects them)
  let html = escapedMarkdown
    // Code blocks with language
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    
    // Headers
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
    
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    
    // Strikethrough
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    
    // Fix the list implementation to handle consecutive items properly
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/<\/ol>\s*<ol>/g, '')
    
    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/<\/blockquote>\s*<blockquote>/g, '<br>')
    
    // Horizontal rule
    .replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '<hr>')
    
    // Links
    .replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Images
    .replace(/!\[([^\[]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Lists (improved to handle consecutive items)
    .replace(/^[\*\-] (.*$)/gm, function(match, content) {
      return '<ul><li>' + content + '</li></ul>';
    })
    .replace(/^(\d+)\. (.*$)/gm, function(match, number, content) {
      return '<ol><li>' + content + '</li></ol>';
    });
    
  // Fix the list implementation to handle consecutive items properly
  html = html
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/<\/ol>\s*<ol>/g, '');
    
  // Handle paragraphs - lines with content that aren't headers, lists, etc.
  html = '<p>' + html.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  // Fix nested paragraph tags in headers, lists, etc.
  html = html
    .replace(/<(h[1-6]|li|blockquote)><p>(.*?)<\/p><\/(h[1-6]|li|blockquote)>/g, '<$1>$2</$1>')
    .replace(/<p><(ul|ol|h[1-6]|blockquote|hr)>/g, '<$1>')
    .replace(/<\/(ul|ol|h[1-6]|blockquote|hr)><\/p>/g, '</$1>');
  
  return html;
}

// Helper function to escape HTML
function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}